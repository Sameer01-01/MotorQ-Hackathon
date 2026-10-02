# ADR-002: Event Streaming Protocol and Delivery Semantics

## Status
**ACCEPTED** (Date: 2026-10-01)

## Context
A commercial fleet of 100,000 active vehicles streams telematics continuously over unstable cellular networks (2G/4G/5G). Events can be delayed, re-transmitted, or delivered out of sequence. The streaming architecture must guarantee that critical anomalies (such as engine overheating or braking failures) are detected within seconds without losing data during 3x shift-start bursts.

## Considered Alternatives
1. **Direct HTTP Ingestion to Database:** Direct writes from gateway to storage; fails under sudden peak bursts and causes cascade outages.
2. **RabbitMQ / AMQP Broker:** Flexible routing, but lacks durable, partitioned immutable log replay and retention capabilities needed for ML backfills and historical reconciliation.
3. **Apache Kafka (KRaft Mode) + Stateful Stream Processing:** Partitioned durable append-only log with partitioned parallelism, backpressure buffering, and reproducible consumer groups.

## Decision
We deploy **Apache Kafka in KRaft mode** coupled with **stateful streaming workers**:
- **Topic Topology:** `telemetry.raw.v1` (partitioned by VIN), `telemetry.canonical.v1` (normalized Avro), `alerts.v1` (high-priority critical signals), `telemetry.dlq.v1` (schema drift & corrupted frames).
- **Partitioning Strategy:** Partitioned strictly on `vin` using uniform hashing. This distributes load evenly across brokers while guaranteeing per-vehicle sequential ordering.
- **Delivery Guarantee:**
  - Ingestion gateway produces with `acks=all` and client idempotence enabled $\to$ **at-least-once** delivery across network hops.
  - Stateful consumers maintain a sliding-window deduplication state keyed on `(vin, seq)` with Bloom pre-filtering $\to$ **effectively-once** delivery at all storage sinks (ClickHouse `ReplacingMergeTree`).

## Consequences
- **Positive:** Zero data loss during 3x peak bursts; replayability allows seamless ML feature backfilling.
- **Negative:** Consumer offsets and deduplication state must be carefully managed to prevent memory bloat.
