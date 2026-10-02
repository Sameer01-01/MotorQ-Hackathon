# ADR-003: CAP and PACELC Trade-Off Architecture

## Status
**ACCEPTED** (Date: 2026-10-01)

## Context
In distributed vehicle telematics, network partitions over cellular connections and distributed clusters are inevitable. The system must explicitly define its consistency vs. availability vs. latency trade-offs for each data class rather than assuming a single uniform consistency model.

## PACELC Classification Matrix

| Data Classification | Storage Engine | PACELC Classification | Justification & Architectural Trade-off |
|---|---|---|---|
| **Billing, User Identity & Work Orders** | PostgreSQL 16 | **PC / EC** (Consistent / Consistent) | Financial transactions and regulatory maintenance orders cannot tolerate anomalies; consistency and integrity strictly trump availability. |
| **Incoming Telemetry Ingest Buffer** | Apache Kafka | **PC / EC** (with `min.insync.replicas=2`) | Telemetry writes require durability and strict replication before acknowledgment; avoids silent message loss. |
| **Historical Telemetry Time-Series** | ClickHouse | **PA / EL** (Available / Lower Latency) | Read queries aggregate millions of rows; sub-second query latency and continuous ingestion take precedence over immediate read-your-writes consistency across replicas. |
| **Live Vehicle Map & Status Cache** | Redis 7 | **PA / EL** (Available / Lower Latency) | Fleets update coordinates every second. A dropped millisecond state packet is superseded by the subsequent tick; availability and sub-millisecond response are paramount. |
| **Audit Logs & Consent Records** | PostgreSQL + Hash Chain | **PC / EC** (Consistent / Consistent) | Compliance and evidentiary validity demand absolute consistency and tamper detection. |

## Consequences
- The platform maintains strong transactional correctness where finances and regulatory actions are concerned, while enabling ultra-fast, highly scalable streaming for high-velocity sensory telemetry.
