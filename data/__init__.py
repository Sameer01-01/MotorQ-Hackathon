"""
══════════════════════════════════════════════════════════════════════════════
INDIAN FLEET MASTER DATA PACKAGE
══════════════════════════════════════════════════════════════════════════════
Exposes authentic Indian transportation ecosystem data:
- 28 Indian States & 8 Union Territories with official RTO district codes
- Genuine OEM catalogue (Tata, Mahindra, Ashok Leyland, Maruti Suzuki, etc.)
- Authentic Indian HSRP Registration Plates (TN01CA2895, HR05AV9078, etc.)
- ISO-3779 compliant Indian VINs with genuine WMI prefixes
- Real Indian Logistics Enterprises (BlueDart, Delhivery, DTDC, VRL, etc.)
- AIS-140 / SAE J1939 Telemetry specifications & DTC Fault Modes
- Certified Workshops across all industrial corridors
- Pre-generated vehicle fleet and maintenance work orders
══════════════════════════════════════════════════════════════════════════════
"""

from .generator import (
    STATES,
    OEMS_CATALOGUE,
    TENANTS,
    DRIVERS,
    WORKSHOPS,
    FAULT_MODES,
    TELEMETRY_SPECS,
    FLAGSHIP_VEHICLES,
    generate_indian_plate,
    generate_indian_vin,
    generate_fleet,
    generate_work_orders,
    _load_json
)

def load_vehicles():
    return _load_json("vehicles.json")

def load_work_orders():
    return _load_json("work_orders.json")

def load_states():
    return _load_json("states.json")

def load_workshops():
    return _load_json("workshops.json")

def load_oems():
    return _load_json("oems_and_models.json")

def load_tenants():
    return _load_json("tenants_and_fleets.json")

def load_telemetry_standards():
    return _load_json("telemetry_specs.json")

__all__ = [
    "STATES",
    "OEMS_CATALOGUE",
    "TENANTS",
    "DRIVERS",
    "WORKSHOPS",
    "FAULT_MODES",
    "TELEMETRY_SPECS",
    "FLAGSHIP_VEHICLES",
    "generate_indian_plate",
    "generate_indian_vin",
    "generate_fleet",
    "generate_work_orders",
    "load_vehicles",
    "load_work_orders",
    "load_states",
    "load_workshops",
    "load_oems",
    "load_tenants",
    "load_telemetry_standards",
]
