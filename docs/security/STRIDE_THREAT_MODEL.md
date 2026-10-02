# STRIDE Threat Model & Security Architecture

## 1. Overview & Trust Boundaries
FleetSentinel processes safety-critical, high-velocity telematics data. The threat model evaluates security risks across six distinct trust zones:
* **Zone 1: Vehicle Edge & Ingest Gateway** (mTLS boundary over public cellular networks)
* **Zone 2: Streaming Event Bus** (Kafka broker network isolation)
* **Zone 3: Persistent Storage** (PostgreSQL RLS, ClickHouse, and MinIO volume encryption)
* **Zone 4: Application REST APIs** (OIDC JWT authentication and RBAC)
* **Zone 5: Web UI Presentation Client** (Browser environment, CSP, and XSS sanitization)
* **Zone 6: AI Copilot & Model Context Protocol (MCP)** (Prompt-injection defenses and action approval gates)

---

## 2. STRIDE Threat Analysis Matrix

| Threat Category | Specific Attack Vector | Potential Impact | Implemented Technical Control | Verification Test |
|---|---|---|---|---|
| **Spoofing** | Rogue edge device attempting to publish false telemetry under another vehicle's VIN | Corrupted fleet health metrics and unauthorized telemetry injection | Mutual TLS (mTLS) with per-device X.509 certificates issued by private CA. EMQX ACL rules enforce that client certificate Common Name (CN) must match the VIN in the topic path: `v1/{tenant}/{vin}/telemetry`. | `tests/security/test_mtls_spoofing.py` |
| **Tampering** | Man-in-the-middle tampering of sensor payloads during transit | Manipulation of coolant/voltage signals to suppress critical safety alerts | Mandatory TLS 1.3 on all transport hops. Payload integrity checked via SHA-256 content hashes verified at ingestion gateway. | Network packet inspection & schema validation test |
| **Repudiation** | Fleet operator denying they approved an emergency workshop dispatch or work order creation | Legal disputes and unverified fleet modifications | Tamper-evident, cryptographically chained immutable audit log. Each audit row stores `(timestamp, user_id, action, prev_hash, curr_hash)` where `curr_hash = SHA256(prev_hash + payload)`. | `tests/compliance/test_audit_hash_chain.py` |
| **Information Disclosure** | Low-privilege analyst tracking the exact real-time GPS coordinates of high-profile transport vehicles | Driver stalking, route sabotage, or privacy breaches under DPDP Act 2023 | Role-Based Access Control (RBAC) with dynamic **Location Masking**. Fleet managers see full precision; analysts see truncated geohashes (~4.9 km cell); auditors see zero coordinates. | `tests/compliance/test_location_masking.py` |
| **Denial of Service** | Malicious burst of telemetry frames aimed at exhausting gateway memory buffers | Gateway pod OOM crashes and delayed anomaly alerting for legitimate vehicles | Bounded in-memory queues with backpressure flow control. Edge gateway responds with HTTP `429 Too Many Requests` and dynamic `Retry-After` headers. Kafka acts as an elastic shock absorber. | `tests/performance/k6_load_test.js` |
| **Elevation of Privilege** | Tenant A sending API queries to fetch vehicle maintenance dossiers belonging to Tenant B | Confidential commercial fleet intelligence leak across competing logistics operators | PostgreSQL **Row-Level Security (RLS)** strictly enforcing `tenant_id` session filtering derived from cryptographically verified OIDC JWT claims. Cannot be bypassed by raw SQL injection. | `tests/integration/test_rls_isolation.py` |

---

## 3. Data Privacy & India DPDP Act 2023 Compliance

FleetSentinel implements a cryptographically verified **Crypto-Shredding Right-to-Erasure Workflow**:
1. Every driver and vehicle owner is assigned an ephemeral pseudonym token linked via an encrypted mapping table (`pseudonym_map`).
2. Each pseudonym key is encrypted using an individual master key managed in HashiCorp Vault.
3. Upon receiving an authorized erasure request, the individual's Vault encryption key is permanently shredded.
4. All historical time-series rows in ClickHouse and compressed Parquet files in MinIO become mathematically unrecoverable ciphertext, fulfilling regulatory erasure requirements without requiring petabyte-scale partition rewrites.
