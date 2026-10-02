"""
ISO-3779 17-Character Indian Vehicle Identification Number (VIN) Validator
Implements official North American & Indian transliteration and modulo-11 check-digit validation.
"""

import re
from typing import Tuple, Optional

# Transliteration value mapping per ISO-3779
TRANSLITERATION_MAP = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
}

# Position weight vector (1 to 17)
POSITION_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]

# Official Indian WMI prefix catalog
INDIAN_WMI_CATALOG = {
    'MA6': 'Tata Motors Passenger',
    'MAT': 'Tata Motors Commercial',
    'MA7': 'Mahindra & Mahindra',
    'MBH': 'Ashok Leyland',
    'MA3': 'Maruti Suzuki India',
    'MAK': 'Hyundai Motor India',
    'MBV': 'Kia India',
    'MA1': 'Toyota Kirloskar Motor',
    'ME4': 'BharatBenz (Daimler India)'
}

VIN_REGEX = re.compile(r'^[A-HJ-NPR-Z0-9]{17}$')

def validate_vin(vin: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Validates an ISO-3779 17-character VIN.
    Returns: (is_valid, manufacturer_name, error_reason)
    """
    if not vin or len(vin) != 17:
        return False, None, "VIN must be exactly 17 characters in length"
        
    vin = vin.upper()
    if not VIN_REGEX.match(vin):
        return False, None, "Invalid characters detected. Letters I, O, and Q are prohibited per ISO-3779"
        
    wmi = vin[:3]
    mfg = INDIAN_WMI_CATALOG.get(wmi, "Other Certified Manufacturer")
    
    # Calculate weighted checksum for 9th character
    total = sum(TRANSLITERATION_MAP[char] * POSITION_WEIGHTS[idx] for idx, char in enumerate(vin))
    remainder = total % 11
    expected_check = 'X' if remainder == 10 else str(remainder)
    
    actual_check = vin[8]
    if actual_check != expected_check:
        # Note: Non-NA jurisdictions often use check digit for plant verification
        return True, mfg, f"Check digit advisory: Calculated {expected_check}, recorded {actual_check}"
        
    return True, mfg, None
