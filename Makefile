# ==============================================================================
# FLEETSENTINEL ENTERPRISE AUTOMATION MAKEFILE
# ==============================================================================

SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help up up-full down seed test bench lint clean status

help:
	@echo "FleetSentinel Control Commands:"
	@echo "  make up          - Start core local development services"
	@echo "  make up-full     - Start clustered infrastructure with Kafka & ClickHouse"
	@echo "  make down        - Tear down all running containers"
	@echo "  make seed        - Seed 100,000 Indian vehicles & master catalog"
	@echo "  make test        - Run full test suite (unit, contract, compliance)"
	@echo "  make bench       - Execute k6 load benchmarks (100K msg/sec)"
	@echo "  make lint        - Run linters (ruff, mypy, eslint)"
	@echo "  make clean       - Remove cache, temp databases, and bytecode"

up:
	powershell -ExecutionPolicy Bypass -File .\run.ps1

up-full:
	docker compose --profile full up -d

down:
	docker compose down -v

seed:
	.\.venv\Scripts\python.exe -m services.api.seed

test:
	.\.venv\Scripts\pytest -v tests/

bench:
	k6 run tests/performance/k6_load_test.js

lint:
	.\.venv\Scripts\ruff check .
	cd services/web && npm run lint

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache/
