"""
══════════════════════════════════════════════════════════════════════════════
INDIAN FLEET MASTER DATA GENERATOR
══════════════════════════════════════════════════════════════════════════════
Generates authentic Indian vehicle registrations across all 28 States and 8 UTs,
ISO-3779 compliant Indian VINs with genuine WMI codes, AIS-140 telematics,
and enterprise maintenance work orders.
══════════════════════════════════════════════════════════════════════════════
"""

import json
import os
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

def _load_json(filename: str):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# Load master schemas
STATES = _load_json("states.json")
OEMS_CATALOGUE = _load_json("oems_and_models.json")
TENANTS = _load_json("tenants_and_fleets.json")
DRIVERS = _load_json("drivers.json")
WORKSHOPS = _load_json("workshops.json")
FAULT_MODES = _load_json("fault_modes.json")
TELEMETRY_SPECS = _load_json("telemetry_specs.json")

POPULAR_SERIES = [
    "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CJ", "CK", "CL", "CM", "CN", "CP", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ",
    "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BJ", "BK", "BL", "BM", "BN", "BP", "BR", "BS", "BT", "BU",
    "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AJ", "AK", "AL", "AM", "AN", "AP", "AR", "AS", "AT", "AU",
    "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DJ", "DK", "DL", "DM", "DN", "DP", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ",
    "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EJ", "EK", "EL", "EM", "EN", "EP", "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ",
    "ME", "QK", "BZ", "AK", "CD", "EF", "GH", "JK", "LM", "PQ", "RS", "TU", "VW", "XY", "ZA"
]

COLOURS = [
    "Pearl Arctic White", "Phantom Black", "Daytona Grey", "Tornado Blue",
    "Silky Silver", "Atlas White", "Foliage Green", "Flame Red", "Titanium Grey"
]

def generate_indian_plate(state_code: Optional[str] = None, district: Optional[str] = None) -> str:
    """
    Generates an authentic Indian High Security Registration Plate (HSRP):
    Format: [State Code 2-char][RTO District 2-digit][Series 2-char][Number 4-digit]
    Examples: TN01CA2895, HR05AV9078, MH12QK4192, DL03CC5901, KA01ME7742
    """
    if state_code:
        state_obj = next((s for s in STATES if s["code"] == state_code), STATES[0])
    else:
        state_obj = random.choice(STATES)
        
    code = state_obj["code"]
    
    if district:
        dist_str = str(district).zfill(2)
    elif "sampleRTOs" in state_obj and state_obj["sampleRTOs"]:
        dist_str = random.choice(state_obj["sampleRTOs"])
    else:
        dist_str = str(random.randint(1, min(state_obj.get("districts", 20), 75))).zfill(2)
        
    series = random.choice(POPULAR_SERIES)
    num = str(random.randint(1000, 9999))
    return f"{code}{dist_str}{series}{num}"

def generate_indian_vin(wmi_prefix: str, year: int = 2024) -> str:
    """
    Generates an authentic ISO-3779 compliant 17-character Indian VIN.
    WMI (Chars 1-3): Genuine Indian OEM identifier (MA6, MA7, MBH, MA3, MAK, MBV, MA1, ME4, MAT)
    VDS (Chars 4-8): Vehicle Descriptor Section
    Check Digit (Char 9): 0-9 or X
    Model Year (Char 10): 2018=J, 2019=K, 2020=L, 2021=M, 2022=N, 2023=P, 2024=R, 2025=S, 2026=T
    Plant Code (Char 11): Genuine Indian automotive assembly plants
        P = Pune, C = Chennai, S = Sanand, G = Gurugram/Manesar, B = Bidadi, H = Hosur, N = Noida
    VIS Sequential (Chars 12-17): 6-digit production sequence number
    """
    vds_chars = "123456789ABCDEFGHJKLMNPRSTUVWXYZ"
    vds = "".join(random.choice(vds_chars) for _ in range(5))
    
    year_map = {
        2018: "J", 2019: "K", 2020: "L", 2021: "M", 2022: "N",
        2023: "P", 2024: "R", 2025: "S", 2026: "T"
    }
    year_char = year_map.get(year, "R")
    plant_char = random.choice(["P", "C", "S", "G", "B", "H", "N"])
    seq = str(random.randint(100000, 999999))
    check_digit = random.choice("0123456789X")
    
    full_vin = f"{wmi_prefix[:3]}{vds}{check_digit}{year_char}{plant_char}{seq}"
    return full_vin[:17]

# Reference flagship vehicles featuring prominently requested Indian plates
FLAGSHIP_VEHICLES = [
    {
        "plate": "TN01CA2895",
        "vin": "MA6TNXZA5P109823",
        "oem": "Tata Motors",
        "model": "Nexon XZ+ (Diesel)",
        "fuel": "Diesel",
        "vehicleClass": "Compact SUV",
        "displacement": "1497cc Turbo Revotorq",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zone": "South",
        "driver": "Karthik Subramanian",
        "driverPhone": "+91 98401 24891",
        "fleetCompany": "BlueDart Express Pvt Ltd",
        "faultMode": "Coolant Overheating Trend",
        "faultCode": "P0217",
        "prob": 0.89,
        "coolant": 108.4,
        "voltage": 13.4,
        "rpm": 2420,
        "speed": 74,
        "odometer": 48210,
        "savingsINR": 48500,
        "severity": "Critical",
        "status": "Depot Inspection"
    },
    {
        "plate": "HR05AV9078",
        "vin": "MA7MX7DA3R201948",
        "oem": "Mahindra & Mahindra",
        "model": "XUV700 AX7 L AWD",
        "fuel": "Diesel",
        "vehicleClass": "Full SUV",
        "displacement": "2184cc mHawk CRDe Turbo",
        "city": "Gurugram",
        "state": "Haryana",
        "zone": "North",
        "driver": "Suresh Chauhan",
        "driverPhone": "+91 98112 87401",
        "fleetCompany": "Delhivery Pvt Ltd",
        "faultMode": "12V Auxiliary Voltage Sag",
        "faultCode": "P0562",
        "prob": 0.84,
        "coolant": 92.1,
        "voltage": 11.2,
        "rpm": 1890,
        "speed": 68,
        "odometer": 62450,
        "savingsINR": 62000,
        "severity": "Critical",
        "status": "Depot Inspection"
    },
    {
        "plate": "MH12QK4192",
        "vin": "MA3FJHB27S309112",
        "oem": "Maruti Suzuki",
        "model": "Brezza ZXi+ Dual Tone",
        "fuel": "Petrol",
        "vehicleClass": "Compact SUV",
        "displacement": "1462cc K15C Smart Hybrid",
        "city": "Pune",
        "state": "Maharashtra",
        "zone": "West",
        "driver": "Nikhil Desai",
        "driverPhone": "+91 98220 54109",
        "fleetCompany": "DTDC Logistics India",
        "faultMode": "Combustion Misfire Cylinder 3",
        "faultCode": "P0303",
        "prob": 0.79,
        "coolant": 96.4,
        "voltage": 13.9,
        "rpm": 3100,
        "speed": 82,
        "odometer": 38900,
        "savingsINR": 32000,
        "severity": "High",
        "status": "Active En Route"
    },
    {
        "plate": "KA01ME7742",
        "vin": "MA6TNEVA9R410852",
        "oem": "Tata Motors",
        "model": "Nexon EV Empowered+",
        "fuel": "EV",
        "vehicleClass": "Compact SUV",
        "displacement": "Permanent Magnet Synchronous AC",
        "city": "Bengaluru",
        "state": "Karnataka",
        "zone": "South",
        "driver": "Balaji Venkataraman",
        "driverPhone": "+91 98450 31289",
        "fleetCompany": "Mahindra Logistics Ltd",
        "faultMode": "High-Voltage EV Pack Degradation",
        "faultCode": "P0A80",
        "prob": 0.81,
        "coolant": 42.0,
        "voltage": 14.2,
        "rpm": 4400,
        "speed": 79,
        "odometer": 29840,
        "savingsINR": 75000,
        "severity": "Critical",
        "status": "Depot Inspection"
    },
    {
        "plate": "DL03CC5901",
        "vin": "MAKGCRPA4P521890",
        "oem": "Hyundai",
        "model": "Creta SX(O) Knight Edition",
        "fuel": "Petrol",
        "vehicleClass": "Mid SUV",
        "displacement": "1497cc Smartstream MPi",
        "city": "Delhi NCR",
        "state": "Delhi NCR",
        "zone": "North",
        "driver": "Rahul Sharma",
        "driverPhone": "+91 98100 48192",
        "fleetCompany": "Rivigo Services Pvt Ltd",
        "faultMode": "Fuel Trim System Too Lean (Bank 1)",
        "faultCode": "P0171",
        "prob": 0.74,
        "coolant": 93.8,
        "voltage": 13.7,
        "rpm": 2150,
        "speed": 62,
        "odometer": 54100,
        "savingsINR": 28500,
        "severity": "High",
        "status": "Active En Route"
    },
    {
        "plate": "GJ01AB1234",
        "vin": "MBVGSXPA2S612984",
        "oem": "Kia",
        "model": "Seltos GTX+ X-Line",
        "fuel": "Petrol",
        "vehicleClass": "Mid SUV",
        "displacement": "1482cc Smartstream Turbo",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "zone": "West",
        "driver": "Mehul Patel",
        "driverPhone": "+91 98250 82190",
        "fleetCompany": "Safexpress Pvt Ltd",
        "faultMode": "Catalytic Converter Below BS-VI Threshold",
        "faultCode": "P0420",
        "prob": 0.68,
        "coolant": 95.2,
        "voltage": 13.8,
        "rpm": 2280,
        "speed": 71,
        "odometer": 41200,
        "savingsINR": 38000,
        "severity": "High",
        "status": "Active En Route"
    },
    {
        "plate": "UP32BZ8819",
        "vin": "MA1IGCDA1R702145",
        "oem": "Toyota",
        "model": "Innova Crysta 2.4 GX",
        "fuel": "Diesel",
        "vehicleClass": "MPV",
        "displacement": "2393cc 2GD-FTV Inline-4",
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "zone": "North",
        "driver": "Rajesh Mishra",
        "driverPhone": "+91 98390 19284",
        "fleetCompany": "TCI Express Ltd",
        "faultMode": "Combustion Misfire Cylinder 1",
        "faultCode": "P0301",
        "prob": 0.72,
        "coolant": 94.6,
        "voltage": 13.9,
        "rpm": 2040,
        "speed": 66,
        "odometer": 78900,
        "savingsINR": 34500,
        "severity": "High",
        "status": "Active En Route"
    }
]

def generate_fleet(total_count: int = 300) -> List[Dict[str, Any]]:
    """
    Generates a full fleet across all 28 Indian States and 8 Union Territories.
    Guarantees representation of every state and UT, with realistic physical telemetry,
    genuine DTC codes, FASTag wallet balances, driver assignments, and PUCC expiry dates.
    """
    results: List[Dict[str, Any]] = []
    
    # 1. Add flagship reference vehicles first
    results.extend(FLAGSHIP_VEHICLES)
    
    # Flatten model catalog
    all_models = []
    for oem in OEMS_CATALOGUE:
        for m in oem["models"]:
            all_models.append({
                "make": oem["make"],
                **m
            })
            
    # Ensure every single state in STATES has at least several vehicles
    state_cycle = [s for s in STATES]
    random.shuffle(state_cycle)
    
    remaining = total_count - len(results)
    now = datetime.now()
    
    for i in range(remaining):
        state_obj = state_cycle[i % len(state_cycle)]
        model_meta = random.choice(all_models)
        tenant_obj = random.choice(TENANTS)
        driver_obj = random.choice(DRIVERS)
        
        prob = round(random.uniform(0.04, 0.96), 2)
        has_fault = prob > 0.70
        
        if has_fault:
            fault = random.choice(FAULT_MODES)
        else:
            fault = {
                "code": "—",
                "label": "None",
                "desc": "Nominal operating conditions — zero active DTCs logged",
                "recommendedPart": "Scheduled Preventive Inspection",
                "estSavingINR": 0,
                "estRepairCostINR": 2500
            }
            
        coolant = round(random.uniform(82.0, 98.0), 1)
        voltage = round(random.uniform(13.5, 14.5), 2)
        rpm = random.randint(750, 3600)
        speed = random.randint(0, 94)
        
        if fault["code"] == "P0217":
            coolant = round(random.uniform(104.5, 118.2), 1)
        elif fault["code"] == "P0562":
            voltage = round(random.uniform(10.8, 12.1), 2)
        elif fault["code"] == "P0507":
            rpm = random.randint(1200, 1850)
            
        plate = generate_indian_plate(state_obj["code"])
        vin = generate_indian_vin(model_meta["wmi"], random.randint(2019, 2025))
        
        savings = fault.get("estSavingINR", 0)
        if savings <= 0:
            savings = max(0, int(prob * 50000 - 10000))
            
        severity = "Critical" if prob > 0.80 else "High" if prob > 0.60 else "Medium" if prob > 0.40 else "Low"
        
        if prob > 0.82:
            status = "Depot Inspection"
        elif speed > 4:
            status = "Active En Route"
        elif speed == 0 and model_meta["fuel"] == "EV":
            status = "Fast Charging"
        else:
            status = "Idling"
            
        # Realistic GPS slight scatter around state hub
        lat = round(state_obj.get("lat", 20.0) + random.uniform(-0.15, 0.15), 5)
        lon = round(state_obj.get("lon", 78.0) + random.uniform(-0.15, 0.15), 5)
        
        last_seen_dt = now - timedelta(seconds=random.randint(10, 7200))
        
        v_record = {
            "plate": plate,
            "vin": vin,
            "oem": model_meta["make"],
            "model": model_meta["name"],
            "fuel": model_meta["fuel"],
            "vehicleClass": model_meta.get("vehicleClass", "Compact SUV"),
            "displacement": model_meta.get("displacement", "1497cc"),
            "fuelTankOrKwh": model_meta.get("fuelTankOrKwh", "45 L"),
            "araiMileage": model_meta.get("araiMileage", "18.5 km/l"),
            "year": random.randint(2018, 2024),
            "colour": random.choice(COLOURS),
            "fleetCompany": tenant_obj["name"],
            "driver": driver_obj["name"],
            "driverPhone": driver_obj["phone"],
            "driverBadge": driver_obj["license"],
            "city": state_obj["capital"],
            "state": state_obj["name"],
            "zone": state_obj["zone"],
            "lat": lat,
            "lon": lon,
            "odometer": random.randint(12000, 198000),
            "speed": speed,
            "coolant": coolant,
            "voltage": voltage,
            "rpm": rpm,
            "soh": round(random.uniform(65, 98), 1) if model_meta["fuel"] == "EV" else 100,
            "dtcCount": random.randint(1, 5) if has_fault else 0,
            "faultMode": fault["label"],
            "faultCode": fault["code"],
            "faultDesc": fault["desc"],
            "prob": prob,
            "severity": severity,
            "status": status,
            "lastSeen": last_seen_dt.isoformat(),
            "fastagBalance": random.randint(850, 9800),
            "insurancePolicy": f"ICICI-LOMBARD-FLT-{random.randint(100000, 999999)}",
            "insuranceExpiry": f"2027-0{random.randint(1, 9)}-{random.randint(10, 28)}",
            "puccExpiry": f"2026-1{random.randint(0, 2)}-{random.randint(10, 28)}",
            "savingsINR": savings
        }
        results.append(v_record)
        
    return results

def generate_work_orders(vehicles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates authentic work orders and maintenance job cards based on fleet faults.
    """
    orders = []
    faulty = [v for v in vehicles if v.get("faultCode") and v["faultCode"] != "—"]
    
    parts_catalog = {
        "P0217": ["OEM Coolant Pump Assembly (Tata #5424)", "Castrol Radicool Premix (5L)", "Thermostat Housing Gasket"],
        "P0562": ["Valeo 140A Alternator Diode Pack", "Exide Epiq DIN74 Auxiliary Battery", "V-Ribbed Serpentine Belt"],
        "P0303": ["NGK Iridium Spark Plugs (Set of 4)", "Denso Direct Ignition Coil #3", "Throttle Body Cleanser Spray"],
        "P0301": ["Bosch High-Pressure Common Rail Injector #1", "Fuel Filter Element Kit", "Injector Copper Washer"],
        "P0A80": ["BMS High-Voltage Cell Balancing Harness Kit", "Dielectric Thermal Interface Compound", "HV Safety Plug"],
        "P0171": ["Bosch MAF Sensor Assembly", "Intake Manifold Viton Gaskets", "PCV Breather Valve"],
        "P0420": ["Downstream Heated Lambda Oxygen Sensor", "BS-VI Exhaust Pipe Flange Seal", "Def Tank Refill"],
        "P0507": ["Electronic Throttle Body Decarb Service Kit", "Idle Stepper Motor Calibration Ring", "Intake Cleaner"]
    }
    
    statuses = ["SCHEDULED", "IN_BAY", "AWAITING_PARTS", "QC_PASSED", "COMPLETED"]
    
    for idx, v in enumerate(faulty[:30]):
        code = v["faultCode"]
        workshop = random.choice(WORKSHOPS)
        parts = parts_catalog.get(code, ["Scheduled Inspection Kit", "Diagnostic Fee"])
        
        wo = {
            "id": f"WO-IND-{8901 + idx}",
            "orderDate": "2026-10-01",
            "scheduledDate": f"2026-10-02 {str(9 + (idx % 8)).zfill(2)}:{random.choice(['00', '30'])}",
            "vehiclePlate": v["plate"],
            "vin": v["vin"],
            "model": f"{v['oem']} {v['model']}",
            "oem": v["oem"],
            "fleetCompany": v["fleetCompany"],
            "workshopName": workshop["name"],
            "city": workshop["city"],
            "state": workshop["state"],
            "faultMode": v["faultMode"],
            "dtcCode": code,
            "priority": v["severity"].upper(),
            "status": statuses[idx % len(statuses)],
            "technician": f"{workshop['head']} (Lead Tech)",
            "allocatedHours": 2.5 if code in ["P0562", "P0303"] else 3.5 if code == "P0217" else 4.0,
            "partsRequired": parts,
            "estimatedCostINR": 8450 if code == "P0217" else 14200 if code == "P0562" else 6800,
            "preventiveSavingINR": v["savingsINR"],
            "jobCardNumber": f"JC-{v['plate'][:4]}-2026-{1000 + idx}"
        }
        orders.append(wo)
        
    return orders

def export_all():
    """Builds and writes all primary datasets into the data folder."""
    vehicles = generate_fleet(300)
    vehicles_path = os.path.join(DATA_DIR, "vehicles.json")
    with open(vehicles_path, "w", encoding="utf-8") as f:
        json.dump(vehicles, f, indent=2)
    print(f"Generated {len(vehicles)} vehicles -> {vehicles_path}")
    
    work_orders = generate_work_orders(vehicles)
    wo_path = os.path.join(DATA_DIR, "work_orders.json")
    with open(wo_path, "w", encoding="utf-8") as f:
        json.dump(work_orders, f, indent=2)
    print(f"Generated {len(work_orders)} work orders -> {wo_path}")

if __name__ == "__main__":
    export_all()
