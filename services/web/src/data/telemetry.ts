/* ═══════════════════════════════════════════════════════════
   TELEMETRY & SENSOR PROTOCOLS (AIS-140 / SAE J1939 Compliant)
   High-precision telemetry streams, CAN bus packet rates,
   and diagnostic thresholds for Indian commercial & passenger fleets.
═══════════════════════════════════════════════════════════ */

export interface TelemetryConfig {
  sensorName: string
  parameter: string
  unit: string
  baseline: number
  safeMin: number
  safeMax: number
  criticalThreshold: number
  warningThreshold: number
  samplingHz: number
  description: string
  aisStandard: string
}

export const TELEMETRY_STANDARDS: Record<string, TelemetryConfig> = {
  coolantTemp: {
    sensorName: 'Engine Coolant Temperature (ECT)',
    parameter: 'OBD_PID_05',
    unit: '°C',
    baseline: 88.5,
    safeMin: 80.0,
    safeMax: 102.0,
    warningThreshold: 103.0,
    criticalThreshold: 108.0,
    samplingHz: 2,
    description: 'Sliding-window engine thermal management sensor via CAN bus PID 0x05',
    aisStandard: 'AIS-140 Section 4.2 / SAE J1979',
  },
  batteryVoltage: {
    sensorName: '12V Auxiliary System Voltage',
    parameter: 'OBD_PID_42',
    unit: 'V',
    baseline: 13.8,
    safeMin: 12.6,
    safeMax: 14.7,
    warningThreshold: 12.4,
    criticalThreshold: 11.6,
    samplingHz: 1,
    description: 'Lead-acid / AGM system bus voltage monitoring alternator charging health',
    aisStandard: 'AIS-004 Part 3 / ISO 16750-2',
  },
  engineRpm: {
    sensorName: 'Crankshaft Rotational Speed',
    parameter: 'OBD_PID_0C',
    unit: 'RPM',
    baseline: 2150,
    safeMin: 650,
    safeMax: 4800,
    warningThreshold: 5100,
    criticalThreshold: 5600,
    samplingHz: 10,
    description: 'Engine RPM from crankshaft position sensor (CKP)',
    aisStandard: 'SAE J1939 / AIS-140 Protocol',
  },
  canBusThroughput: {
    sensorName: 'CAN 2.0B Telematics Ingest',
    parameter: 'CAN_MSG_INGEST',
    unit: 'frames/sec',
    baseline: 4200,
    safeMin: 1200,
    safeMax: 8500,
    warningThreshold: 7200,
    criticalThreshold: 8800,
    samplingHz: 5,
    description: 'Cluster-level telematics message ingestion from OEM telematics control units (TCU)',
    aisStandard: 'AIS-140 Intelligent Transportation Systems (ITS)',
  },
  ruleEngineP99: {
    sensorName: 'ML Inference & Rule Engine P99 Latency',
    parameter: 'PIPE_P99_MS',
    unit: 'ms',
    baseline: 38.2,
    safeMin: 5.0,
    safeMax: 80.0,
    warningThreshold: 65.0,
    criticalThreshold: 100.0,
    samplingHz: 1,
    description: 'Sliding window windowed feature extractor and RandomForest failure classification latency',
    aisStandard: 'Enterprise SLA Tier-1 (< 80ms P99)',
  },
  dlqRate: {
    sensorName: 'Dead-Letter Queue Invalidation Rate',
    parameter: 'DLQ_ERR_COUNT',
    unit: 'err/sec',
    baseline: 2.1,
    safeMin: 0.0,
    safeMax: 15.0,
    warningThreshold: 12.0,
    criticalThreshold: 25.0,
    samplingHz: 1,
    description: 'Corrupted CAN frame payloads rejected by AIS-140 schema validation validator',
    aisStandard: 'ISO 26262 ASIL-B Data Integrity',
  },
}

export const LIVE_FLEET_BENCHMARKS = {
  totalMonitoredVehicles: 100000,
  activeEnRoute: 86420,
  depotMaintenance: 4180,
  idleStandby: 9400,
  totalTelemetryEventsToday: '842.6M',
  telemetryIngestRate: '4,218 msgs/sec',
  dataPayloadProcessedGB: '148.4 GB',
  meanTimeToDetectionMinutes: 3.4,
  estimatedCatastrophicFailuresAvoided: 412,
  totalSavedINR: '₹ 1.84 Crores',
  fastagFleetDeductionToday: '₹ 14,82,900',
}
