# ==============================================================================
# FLEETSENTINEL CLOUD-AGNOSTIC TERRAFORM INFRASTRUCTURE (GCP / GKE)
# Defines VPC, Subnet, GKE Clustered Nodes & Object Storage Bucket
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
  default     = "fleetsentinel-production"
}

variable "region" {
  description = "Target deployment region"
  type        = string
  default     = "asia-south1" # Mumbai, India
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Virtual Private Cloud (VPC)
resource "google_compute_network" "fleet_vpc" {
  name                    = "fleetsentinel-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "fleet_subnet" {
  name          = "fleetsentinel-subnet-01"
  ip_cidr_range = "10.10.0.0/20"
  region        = var.region
  network       = google_compute_network.fleet_vpc.id
}

# Managed GKE Kubernetes Cluster
resource "google_container_cluster" "primary" {
  name     = "fleetsentinel-gke-cluster"
  location = var.region

  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.fleet_vpc.id
  subnetwork = google_compute_subnetwork.fleet_subnet.id

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "telemetry-worker-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = 3

  node_config {
    machine_type = "e2-standard-8" # 8 vCPUs, 32 GB RAM per node
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  autoscaling {
    min_node_count = 3
    max_node_count = 12
  }
}

# Object Storage for Cold Parquet Telemetry Archive
resource "google_storage_bucket" "telemetry_archive" {
  name          = "fleetsentinel-cold-parquet-archive"
  location      = "ASIA"
  force_destroy = false

  lifecycle_rule {
    condition {
      age = 90 # Transition to Coldline after 90 days
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
}
