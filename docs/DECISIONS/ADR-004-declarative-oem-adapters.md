# ADR-004: Declarative OEM Payload Adapters with Zero-Downtime Hot Reload

## Status
**ACCEPTED** (Date: 2026-10-01)

## Context
Commercial fleets comprise diverse OEM vehicle makes (Tata Motors, Mahindra, Ashok Leyland, Maruti Suzuki, BharatBenz). Each manufacturer outputs different wire protocols:
- JSON with imperial units (mph, °F) vs. metric (km/h, °C).
- Hex-encoded signal arrays (`[{"id": "0x01", "v": 74}]`) vs. flat dictionaries.
- Varying timestamp encodings (epoch seconds vs. epoch milliseconds vs. ISO-8601 UTC).

Hardcoding OEM transformation logic into monolithic code leads to risky deployments, downtime, and pipeline fragility whenever an OEM alters their telematics firmware.

## Decision
We implement **Declarative, Versioned OEM Mapping Adapters**:
1. **Mapping Specs:** Ingestion adapters are declared as versioned JSON/YAML mapping schemas stored in PostgreSQL metadata tables (`oem_adapter_version`).
2. **Shadow-Mode Validation:** New adapter versions are deployed in "shadow mode"—running concurrently against live streams without routing to production sinks—to verify output correctness.
3. **Automatic Schema Drift Detection:** If an incoming payload contains unmapped fields, corrupted types, or unit anomalies, it is diverted to a Dead-Letter Queue (`telemetry.dlq.v1`) and triggers an administrative drift alert rather than crashing the consumer.
4. **Hot Reloading:** Ingestion normalizer workers listen to metadata invalidation events and dynamically update mapping parsers without restarting JVM or container instances.

## Consequences
- **Positive:** New OEM telematics feeds can be integrated and promoted to production in minutes with zero downtime.
- **Negative:** Schema validation overhead adds ~2-4 ms per packet on the ingestion hot path.
