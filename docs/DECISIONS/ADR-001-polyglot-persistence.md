# ADR-001: Polyglot Persistence Strategy

## Status
**ACCEPTED** (Date: 2026-10-01)

## Context
FleetSentinel ingests, processes, and queries diverse data shapes across 100,000+ connected vehicles:
1. Highly relational metadata (tenants, fleets, drivers, work orders, billing, access policies) requiring strict ACID transactions and Row-Level Security.
2. High-velocity time-series CAN bus frames (4,218 msgs/sec base, 12,000+ msgs/sec burst) requiring high-compression append-only columnar storage.
3. Sub-second live fleet positions and token-bucket rate limits requiring sub-millisecond in-memory key-value lookups.
4. Schema-drifting and unmapped raw OEM payloads requiring document-oriented JSON isolation.

A single unified database cannot satisfy these conflicting latency, throughput, and consistency profiles without severe performance bottlenecks or exorbitant operational costs.

## Considered Alternatives
1. **Monolithic PostgreSQL:** Capable of JSONB and relational tables, but struggles to sustain continuous 5,000+ row/sec inserts while serving heavy analytical aggregates over hundreds of millions of historical telemetry rows.
2. **Apache Cassandra / ScyllaDB:** High write throughput, but operational maintenance is excessively complex, and ad-hoc aggregations (such as rolling percentile slopes across sliding windows) require heavy secondary analytics infrastructure.
3. **TimescaleDB:** Strong time-series features on top of Postgres, but ClickHouse significantly outperforms Timescale in both columnar data compression (up to 90% reduction with Delta/Gorilla/ZSTD codecs) and analytical scan speeds over wide fleets.

## Decision
We adopt a **Polyglot Persistence Architecture**:
- **PostgreSQL 16 (OLTP):** ACID relational core in Third Normal Form (3NF), tenant isolation via Postgres Row-Level Security (RLS), and vector search via `pgvector`.
- **ClickHouse / DuckDB (Analytics):** Append-only columnar storage for canonical telemetry streams, AggregatingMergeTree views for 1-minute and 1-hour historical rollups.
- **Redis 7 (Hot State & Cache):** In-memory sliding-window cache for vehicle latest positions, pub/sub for real-time dashboard notifications, and distributed token-bucket rate limiting.
- **MongoDB (Document Store):** Raw OEM message samples, schema drift captures, and agent conversation audit logs.
- **MinIO / S3 (Cold Archive):** Hourly compressed Hive-partitioned Parquet files.

## Consequences
- **Positive:** Each workload utilizes its mathematically optimal storage engine; sub-second live map sync and analytical queries do not compete for relational transaction locks.
- **Negative:** Requires disciplined synchronization through asynchronous event buses and transactional outbox patterns.
