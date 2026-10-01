import asyncio
import random
import time
import uuid
import numpy as np
from datetime import datetime, timezone
from sqlmodel import Session, select
from typing import List

from services.api.database import engine
from services.api.models import Vehicle

class FleetSimulator:
    def __init__(self, queue: asyncio.Queue, target_events_per_sec: int = 5000):
        self.queue = queue
        self.target_events_per_sec = target_events_per_sec
        self.vins = []
        self.num_vehicles = 0
        
        # Vectorized state
        self.speeds = np.array([])
        self.coolants = np.array([])
        self.voltages = np.array([])
        self.lats = np.array([])
        self.lons = np.array([])
        
        # 3 failure modes ground truth tracking
        # We pick some random indices to suffer from these modes
        self.overheating_idx = set()
        self.voltage_sag_idx = set()
        self.misfire_idx = set()

    def load_vehicles(self):
        with Session(engine) as session:
            vehicles = session.exec(select(Vehicle.vin, Vehicle.model_id)).all()
            self.vins = [v[0] for v in vehicles]
            self.num_vehicles = len(self.vins)
            
            # Initial states
            self.speeds = np.zeros(self.num_vehicles)
            self.coolants = np.full(self.num_vehicles, 85.0)  # Normal coolant ~ 85C
            self.voltages = np.full(self.num_vehicles, 14.2)  # Normal alternator voltage
            
            # Base locations (randomly scattered in a bounding box, e.g., a city)
            self.lats = np.random.uniform(12.8, 13.1, self.num_vehicles)
            self.lons = np.random.uniform(77.5, 77.8, self.num_vehicles)
            
            # Assign faults to 1% of vehicles each
            indices = list(range(self.num_vehicles))
            random.shuffle(indices)
            
            fault_count = max(1, int(self.num_vehicles * 0.01))
            self.overheating_idx = set(indices[:fault_count])
            self.voltage_sag_idx = set(indices[fault_count:fault_count*2])
            self.misfire_idx = set(indices[fault_count*2:fault_count*3])
            
            print(f"Simulator loaded {self.num_vehicles} vehicles.")

    def step(self):
        """Update physics vectors for the next tick."""
        # Random speed walk
        accel = np.random.normal(0, 5, self.num_vehicles)
        self.speeds = np.clip(self.speeds + accel, 0, 120)
        
        # Coolant changes (increases when driving, decreases when stopped)
        heat_delta = np.where(self.speeds > 0, np.random.normal(0.1, 0.05, self.num_vehicles), -0.5)
        self.coolants = np.clip(self.coolants + heat_delta, 20, 110)
        
        # Apply hidden faults
        if self.overheating_idx:
            idx_list = list(self.overheating_idx)
            # Drifting up by +0.05 per tick
            self.coolants[idx_list] += 0.05
            
        if self.voltage_sag_idx:
            idx_list = list(self.voltage_sag_idx)
            # Sagging down by -0.01 per tick
            self.voltages[idx_list] -= 0.01
            
        # Move coordinates slightly based on speed
        # roughly 1 deg = 111km. Speed is km/h. Tick is approx 1 sec.
        distance_deg = (self.speeds / 3600) / 111.0
        angles = np.random.uniform(0, 2*np.pi, self.num_vehicles)
        self.lats += np.sin(angles) * distance_deg
        self.lons += np.cos(angles) * distance_deg

    def generate_payload(self, idx: int, seq: int) -> dict:
        vin = self.vins[idx]
        oem = ["Tata Motors", "Mahindra", "Ashok Leyland"][idx % 3]
        
        dtcs = []
        if idx in self.misfire_idx and random.random() < 0.05:
            dtcs.append(random.choice(["P0300", "P0301", "P0302", "P0303", "P0304"]))

        base_ts = time.time()
        
        if oem == "Tata Motors":
            return {
                "oem": "Tata Motors",
                "vehicleId": vin,
                "sequence": seq,
                "timestampMs": int(base_ts * 1000),
                "data": {
                    "spd": float(self.speeds[idx]),
                    "coolantC": float(self.coolants[idx]),
                    "batV": float(self.voltages[idx]),
                    "loc": [float(self.lons[idx]), float(self.lats[idx])],
                    "faults": dtcs
                }
            }
        elif oem == "Mahindra":
            return {
                "oem": "Mahindra",
                "VIN": vin,
                "seqNo": seq,
                "Time_ISO": datetime.fromtimestamp(base_ts, tz=timezone.utc).isoformat(),
                "Signals": [
                    {"id": "0x01", "v": float(self.speeds[idx])},
                    {"id": "0x02", "v": float(self.coolants[idx])},
                    {"id": "0x03", "v": float(self.voltages[idx])}
                ],
                "GPS_Lat": float(self.lats[idx]),
                "GPS_Lon": float(self.lons[idx]),
                "DTC_List": dtcs
            }
        else:
            return {
                "oem": "Ashok Leyland",
                "id": vin,
                "s": seq,
                "ts": base_ts,
                "v": float(self.speeds[idx]),
                "temp": float(self.coolants[idx]),
                "volt": float(self.voltages[idx]),
                "lat": float(self.lats[idx]),
                "lon": float(self.lons[idx]),
                "diag": dtcs
            }

    async def run_loop(self):
        self.load_vehicles()
        seqs = np.zeros(self.num_vehicles, dtype=np.int64)
        
        batch_size = self.target_events_per_sec // 10
        if batch_size < 1: batch_size = 1
        
        print(f"Simulator started. Target: {self.target_events_per_sec} evt/s")
        
        while True:
            start_t = time.time()
            self.step()
            
            # Pick a random subset of vehicles to emit in this cycle
            indices = np.random.choice(self.num_vehicles, batch_size, replace=False)
            
            payloads = []
            for idx in indices:
                seqs[idx] += 1
                payload = self.generate_payload(idx, seqs[idx])
                payloads.append(payload)
                
            # Inject bursts / dupes / out-of-order randomly
            if random.random() < 0.01: # 1% chance of duplicate
                payloads.append(payloads[0])
                
            for p in payloads:
                await self.queue.put(p)
                
            elapsed = time.time() - start_t
            sleep_time = (1.0 / 10.0) - elapsed
            if sleep_time > 0:
                await asyncio.sleep(sleep_time)
            else:
                await asyncio.sleep(0) # yield
