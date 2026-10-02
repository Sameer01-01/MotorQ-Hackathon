// =============================================================================
// FLEETSENTINEL ENTERPRISE K6 LOAD BENCHMARK
// Simulates 1,000 concurrent Virtual Users hitting vehicle endpoints
// Evaluates API p95 < 200ms and p99 < 500ms under heavy read/write load
// =============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 200 },  // Ramp-up to 200 VUs
    { duration: '1m',  target: 1000 }, // Peak sustained load at 1000 VUs
    { duration: '30s', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'], // 95% of requests must complete below 200ms
    http_req_failed: ['rate<0.01'],                 // Error rate must remain under 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8000';

export default function () {
  // 1. Health check verification
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
  });

  // 2. Keyset paginated vehicle feed
  const vehiclesRes = http.get(`${BASE_URL}/vehicles?limit=25`);
  check(vehiclesRes, {
    'vehicles status is 200': (r) => r.status === 200,
    'returned vehicles array': (r) => JSON.parse(r.body).length > 0,
  });

  sleep(0.1);
}
