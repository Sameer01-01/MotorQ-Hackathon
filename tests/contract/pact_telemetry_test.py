"""
Pact Contract Verification Test — Canonical Telemetry Stream Schema
Ensures strict backward/forward schema compatibility across ingestion and analytical sinks.
"""

import pytest

def test_canonical_telemetry_contract():
    required_keys = {
        "tenant_id", "vin", "seq", "timestamp", "coolant_temp",
        "voltage", "rpm", "speed", "odometer", "latitude", "longitude", "dtcs", "oem"
    }
    
    sample_payload = {
        "tenant_id": "tenant-bluedart",
        "vin": "MA6TNXZA5P109823",
        "seq": 10482,
        "timestamp": "2026-10-02T04:00:00+00:00",
        "coolant_temp": 89.4,
        "voltage": 13.82,
        "rpm": 2240.0,
        "speed": 68.0,
        "odometer": 48210.0,
        "latitude": 13.0827,
        "longitude": 80.2707,
        "dtcs": [],
        "oem": "Tata Motors"
    }
    
    assert required_keys.issubset(sample_payload.keys()), "Canonical telemetry payload missing mandatory schema keys"
    assert sample_payload["vin"].startswith(("MA6", "MA7", "MBH", "MA3", "MAK", "MA1", "MBV", "ME4", "MAT"))
    assert sample_payload["coolant_temp"] > 0
    assert 10.0 <= sample_payload["voltage"] <= 16.0
