# ADR-005: Cloud-Agnostic Infrastructure and Open-Standard Interfaces

## Status
**ACCEPTED** (Date: 2026-10-01)

## Context
Enterprise hackathon submissions must be cloud-portable. Solutions locked to specific proprietary cloud primitives (e.g. AWS Kinesis, DynamoDB, Azure IoT Hub) fail when evaluated across heterogeneous client infrastructure.

## Decision
We enforce a strict **Cloud-Agnostic Engineering Policy**:
1. **Open Protocols Only:**
   - Object Storage: S3 API specification via MinIO.
   - Messaging: Apache Kafka wire protocol (deployable on Strimzi, MSK, or Confluent).
   - Relational: PostgreSQL wire protocol (AWS RDS, GCP Cloud SQL, or CloudNativePG Operator).
   - Observability: OpenTelemetry standard with Prometheus and Loki.
2. **Infrastructure as Code (IaC):**
   - Cloud differences are isolated entirely within `infra/terraform/<cloud>/`.
   - The identical Helm charts run on local `kind`/`k3d` clusters as well as enterprise Kubernetes (GKE, EKS, AKS) with only environment-specific `values-<env>.yaml` toggles.

## Consequences
- **Positive:** Zero vendor lock-in; platform can be deployed across on-premise private clouds, hybrid multi-clouds, or developer laptops with zero code changes.
- **Negative:** Prevents using proprietary single-click serverless cloud conveniences.
