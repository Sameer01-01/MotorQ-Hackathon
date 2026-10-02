"""
SAE J1939 & AIS-140 Diagnostic Trouble Code (DTC) Classification Library
Classifies powertrain, chassis, body, and network DTC codes into standardized subsystem domains.
"""

import re
from typing import Dict, Any, Optional

DTC_PATTERN = re.compile(r'^([PCBU])([0-3])([0-9A-F]{2})([0-9A-F])$')

SYSTEM_MAP = {
    'P': 'Powertrain (Engine & Transmission)',
    'C': 'Chassis (Braking & Steering)',
    'B': 'Body (Cabin, Lighting & HVAC)',
    'U': 'Network (CAN Bus & ECU Communication)'
}

SEVERITY_LOOKUP = {
    'P0217': 'Critical',
    'P0562': 'Critical',
    'P0A80': 'Critical',
    'P0300': 'High',
    'P0301': 'High',
    'P0302': 'High',
    'P0303': 'High',
    'P0304': 'High',
    'P0171': 'Medium',
    'P0420': 'Medium',
    'P0507': 'Low'
}

def parse_dtc(code: str) -> Optional[Dict[str, Any]]:
    """
    Parses a 5-character OBD-II / SAE DTC code into structured diagnostic attributes.
    """
    if not code:
        return None
        
    code = code.strip().upper()
    match = DTC_PATTERN.match(code)
    if not match:
        return None
        
    category_code, standard_code, subsystem_hex, fault_hex = match.groups()
    
    is_standard = standard_code in ('0', '2')
    standard_type = "ISO/SAE Standardized Code" if is_standard else "OEM Manufacturer Specific Code"
    system_name = SYSTEM_MAP.get(category_code, "Unknown Vehicle Subsystem")
    severity = SEVERITY_LOOKUP.get(code, "Medium")
    
    return {
        "code": code,
        "category": category_code,
        "system": system_name,
        "standardType": standard_type,
        "severity": severity,
        "hexSubsystem": subsystem_hex,
        "hexFault": fault_hex
    }
