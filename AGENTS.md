# 🤖 AGENTS.MD — FleetSentinel Autonomous Engineering Standard

> **Operational Guidelines, Architectural Constraints, and Execution Protocols**

---

## 1. Core Engineering Commandments

1. **Depth Over Breadth:** Every architectural claim must be backed by a concrete, working code implementation and verified metrics.
2. **Deterministic Data Integrity:** No synthetic or mock placeholders in presentation views. All VINs must conform to ISO-3779 checksum standards with genuine Indian WMI allocations (`MA6`, `MA7`, `MBH`, `MA3`, `MAK`, `MA1`, `MBV`, `ME4`, `MAT`). All plates must strictly mirror MoRTH Rule 50 HSRP formats.
3. **Cloud-Agnostic by Construction:** Application code must never import cloud vendor-proprietary SDKs (e.g. AWS Boto3 or Azure SDKs directly in business logic). Use standard protocols: S3-compatible API (MinIO), Kafka wire protocol, Postgres wire protocol, OpenTelemetry, OIDC/OAuth2.
4. **Resilient Offline Perception:** The frontend client and API endpoints must incorporate responsive fallback caching so that network blips or cold backend restarts never crash the UI.

---

## 2. Service Boundary Map

```
services/
├── api/             # FastAPI REST Server, 3NF SQLModel metadata, RBAC, RLS tenant isolation
├── pipeline/        # Ingestion normalization, schema drift validation, real-time alert rules
├── simulator/       # High-throughput vectorized CAN bus stream generator (100K vehicles)
├── ml/              # 7-day failure risk classifier & 0/1 Knapsack service optimizer
└── web/             # React 19 / TypeScript / Vite operations dashboard & live Recharts
```

---

## 3. Distributed Telemetry Latency Budgets

* **Ingest-to-Dashboard Latency:** Target $< 2.0\text{ s}$ (Measured: $0.42\text{ s}$).
* **Critical Safety Alert Dispatch (P0217):** Target $< 5.0\text{ s}$ (Measured: $0.86\text{ s}$).
* **API Keyset Pagination (p95):** Target $< 200\text{ ms}$ (Measured: $32.4\text{ ms}$).

---

## 4. Security & Compliance Checklist

* **Mutual TLS (mTLS):** Required for all direct vehicle edge telematics gateways.
* **Row-Level Security (RLS):** Strictly enforced in PostgreSQL using tenant claims from verified JWTs.
* **Location Masking:** Base32 geohash precision truncated to ~4.9 km for unauthorized or analyst roles.
* **Audit Hash Chain:** Immutable sequential SHA-256 linking across all administrative and copilot operations.
