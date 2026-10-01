from collections import deque
from services.api.models import Alert
from services.api.database import get_session
import uuid

class VehicleState:
    def __init__(self):
        # Sliding windows (O(1) appending and length bounding)
        self.coolant_window = deque(maxlen=10)
        self.voltage_window = deque(maxlen=10)
        self.dtcs = set()
        self.speed_window = deque(maxlen=10)

class RuleEngine:
    def __init__(self):
        self.state_map = {} # vin -> VehicleState
        self.active_alerts = set() # vin_type -> to avoid alert spam

    def process_event(self, canon_event: dict, session):
        vin = canon_event["vin"]
        if vin not in self.state_map:
            self.state_map[vin] = VehicleState()
            
        state = self.state_map[vin]
        
        # Update state
        state.coolant_window.append(canon_event["coolant_temp"])
        state.voltage_window.append(canon_event["voltage"])
        state.speed_window.append(canon_event["speed"])
        if canon_event["dtcs"]:
            state.dtcs.update(canon_event["dtcs"])
            
        # Check Rules
        alerts = []
        
        # 1. Overheating Trend: 3 recent temps > 105C
        if len(state.coolant_window) >= 3:
            recent = list(state.coolant_window)[-3:]
            if all(t > 105.0 for t in recent):
                alert_key = f"{vin}_Overheating"
                if alert_key not in self.active_alerts:
                    self.active_alerts.add(alert_key)
                    alerts.append(Alert(vin=vin, alert_type="Overheating", severity="Critical", timestamp=canon_event["timestamp"]))

        # 2. Voltage Sag: < 12.5V while engine running (RPM > 0 or Speed > 0)
        if canon_event["voltage"] < 12.5 and (canon_event["speed"] > 0 or canon_event["rpm"] > 0):
            alert_key = f"{vin}_VoltageSag"
            if alert_key not in self.active_alerts:
                self.active_alerts.add(alert_key)
                alerts.append(Alert(vin=vin, alert_type="VoltageSag", severity="High", timestamp=canon_event["timestamp"]))
                
        # 3. Misfire DTC escalation
        misfires = [dtc for dtc in state.dtcs if dtc in ["P0300", "P0301", "P0302", "P0303", "P0304"]]
        if len(misfires) >= 2:
             alert_key = f"{vin}_Misfire"
             if alert_key not in self.active_alerts:
                self.active_alerts.add(alert_key)
                alerts.append(Alert(vin=vin, alert_type="Misfire", severity="Medium", timestamp=canon_event["timestamp"]))

        if alerts:
            session.add_all(alerts)
            session.commit()
            return alerts
            
        return []
