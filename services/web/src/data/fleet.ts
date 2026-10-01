/* ═══════════════════════════════════════════════════════════
   VEHICLE FLEET MASTER DATA GENERATOR
   Authentic Indian transport vehicles across all 28 states & UTs.
   Includes prominent state plates (TN01CA2895, HR05AV9078, etc.)
   and ISO-3779 compliant Indian VINs with genuine WMI codes.
═══════════════════════════════════════════════════════════ */

import {
  VEHICLE_CATALOGUE, INDIAN_DRIVER_NAMES, INDIAN_CITIES_DETAILED,
  FLEET_COMPANIES, INDIAN_STATES,
  generateLicensePlate, generateVIN, type IndianState,
} from './india'

/* ── Random helpers ── */
const ri = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a
const r  = (a: number, b: number) => +(Math.random() * (b - a) + a).toFixed(2)
const pick = <T,>(arr: T[]): T => arr[ri(0, arr.length - 1)]

/* ── Real SAE / AIS Diagnostic Fault Codes ── */
export interface FaultModeInfo {
  code: string
  label: string
  desc: string
  recommendedPart: string
  estSavingINR: number
  estRepairCostINR: number
}

export const FAULT_MODES: FaultModeInfo[] = [
  {
    code: 'P0217',
    label: 'Coolant Overheating',
    desc: 'Engine coolant temperature exceeds calibrated safety ceiling (>105°C) — cooling circuit pressure loss or thermostat stuck',
    recommendedPart: 'OEM Water Pump & Thermostat Kit',
    estSavingINR: 48500,
    estRepairCostINR: 8450,
  },
  {
    code: 'P0562',
    label: 'Voltage Sag',
    desc: 'System bus potential below nominal 12.4V — alternator diode ripple breakdown or deep parasitic load',
    recommendedPart: 'Valeo 140A Alternator Diode Pack',
    estSavingINR: 62000,
    estRepairCostINR: 14200,
  },
  {
    code: 'P0303',
    label: 'Misfire Cyl 3',
    desc: 'Combustion irregularity detected in Cylinder 3 — spark discharge interruption or direct injector nozzle fouling',
    recommendedPart: 'Denso Direct Ignition Coil & NGK Iridium Plugs',
    estSavingINR: 32000,
    estRepairCostINR: 6800,
  },
  {
    code: 'P0301',
    label: 'Misfire Cyl 1',
    desc: 'Cylinder 1 misfire pattern observed under load — high-pressure fuel rail pulse anomaly',
    recommendedPart: 'Bosch High-Pressure Fuel Injector',
    estSavingINR: 34500,
    estRepairCostINR: 7200,
  },
  {
    code: 'P0A80',
    label: 'EV Pack Degradation',
    desc: 'High-voltage traction battery cell voltage variance > 120mV — State of Health below warranty threshold',
    recommendedPart: 'BMS High-Voltage Cell Balancing Harness',
    estSavingINR: 75000,
    estRepairCostINR: 11500,
  },
  {
    code: 'P0171',
    label: 'Fuel System Lean (B1)',
    desc: 'Bank 1 air-to-fuel mixture too lean — unmetered post-MAF intake leak or fuel pump pressure drift',
    recommendedPart: 'Bosch MAF Sensor & Manifold O-Rings',
    estSavingINR: 28500,
    estRepairCostINR: 7400,
  },
  {
    code: 'P0420',
    label: 'Catalyst Efficiency Low',
    desc: 'Three-way catalytic converter oxygen storage capacity below BS-VI stage 2 emission threshold',
    recommendedPart: 'Downstream Heated Lambda Oxygen Sensor',
    estSavingINR: 38000,
    estRepairCostINR: 5200,
  },
  {
    code: 'P0507',
    label: 'Idle RPM High',
    desc: 'Idle air control rotational rate sustained > 250 RPM above ECU target — throttle body carbon buildup',
    recommendedPart: 'Electronic Throttle Body Decarb Service',
    estSavingINR: 19000,
    estRepairCostINR: 3600,
  },
]

export interface Vehicle {
  plate: string
  vin: string
  oem: string
  model: string
  fuel: string
  vehicleClass: string
  displacement: string
  fuelTankOrKwh: string
  araiMileage: string
  year: number
  colour: string
  fleetCompany: string
  driver: string
  driverPhone: string
  driverBadge: string
  city: string
  state: string
  zone: string
  lat: number
  lon: number
  odometer: number
  speed: number
  coolant: number
  voltage: number
  rpm: number
  soh: number
  dtcCount: number
  faultMode: string
  faultCode: string
  faultDesc: string
  prob: number
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Active En Route' | 'Idling' | 'Fast Charging' | 'Depot Inspection' | 'Scheduled Service'
  lastSeen: string
  fastagBalance: number
  insurancePolicy: string
  insuranceExpiry: string
  puccExpiry: string
  savingsINR: number
}

const COLOURS = [
  'Pearl Arctic White', 'Phantom Black', 'Daytona Grey', 'Tornado Blue',
  'Silky Silver', 'Atlas White', 'Foliage Green', 'Flame Red', 'Titanium Grey'
]

// Handcrafted prominent reference fleet matching the user's specific examples
const PROMINENT_SEEDS = [
  {
    plate: 'TN01CA2895',
    vin: 'MA6TNXZA5P109823',
    oem: 'Tata Motors',
    model: 'Nexon XZ+ (Diesel)',
    fuel: 'Diesel',
    vehicleClass: 'Compact SUV',
    displacement: '1497cc Turbo',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zone: 'South',
    driver: 'Karthik Subramanian',
    fleetCompany: 'BlueDart Express Pvt Ltd',
    faultMode: 'Coolant Overheating',
    faultCode: 'P0217',
    prob: 0.89,
    coolant: 108.4,
    voltage: 13.4,
    rpm: 2420,
    speed: 74,
  },
  {
    plate: 'HR05AV9078',
    vin: 'MA7MX7DA3R201948',
    oem: 'Mahindra',
    model: 'XUV700 AX7 L AWD',
    fuel: 'Diesel',
    vehicleClass: 'Full SUV',
    displacement: '2184cc mHawk CRDe',
    city: 'Gurugram',
    state: 'Haryana',
    zone: 'North',
    driver: 'Suresh Chauhan',
    fleetCompany: 'Delhivery Pvt Ltd',
    faultMode: 'Voltage Sag',
    faultCode: 'P0562',
    prob: 0.84,
    coolant: 92.1,
    voltage: 11.2,
    rpm: 1890,
    speed: 68,
  },
  {
    plate: 'MH12AB3491',
    vin: 'MA3FJHB27S309112',
    oem: 'Maruti Suzuki',
    model: 'Brezza ZXi+ Dual Tone',
    fuel: 'Petrol',
    vehicleClass: 'Compact SUV',
    displacement: '1462cc K15C Smart Hybrid',
    city: 'Pune',
    state: 'Maharashtra',
    zone: 'West',
    driver: 'Nikhil Desai',
    fleetCompany: 'DTDC Logistics India',
    faultMode: 'Misfire Cyl 3',
    faultCode: 'P0303',
    prob: 0.79,
    coolant: 96.4,
    voltage: 13.9,
    rpm: 3100,
    speed: 82,
  },
  {
    plate: 'KA01ME7742',
    vin: 'MA6TNEVA9R410852',
    oem: 'Tata Motors',
    model: 'Nexon EV Empowered+',
    fuel: 'EV',
    vehicleClass: 'Compact SUV',
    displacement: 'Permanent Magnet AC',
    city: 'Bengaluru',
    state: 'Karnataka',
    zone: 'South',
    driver: 'Deepa Pillai',
    fleetCompany: 'Mahindra Logistics Ltd',
    faultMode: 'EV Pack Degradation',
    faultCode: 'P0A80',
    prob: 0.76,
    coolant: 84.0,
    voltage: 13.8,
    rpm: 0,
    speed: 45,
  },
  {
    plate: 'DL03CC5901',
    vin: 'MAKGCRPA4P521890',
    oem: 'Hyundai',
    model: 'Creta SX(O) Knight Edition',
    fuel: 'Petrol',
    vehicleClass: 'Mid SUV',
    displacement: '1497cc MPi',
    city: 'Delhi NCR',
    state: 'Delhi',
    zone: 'North',
    driver: 'Amit Kumar Singh',
    fleetCompany: 'TCI Express Ltd',
    faultMode: 'Fuel System Lean (B1)',
    faultCode: 'P0171',
    prob: 0.68,
    coolant: 94.2,
    voltage: 13.7,
    rpm: 2150,
    speed: 58,
  },
  {
    plate: 'GJ01GH3456',
    vin: 'MBVGSXPA2S612984',
    oem: 'Kia',
    model: 'Seltos GTX+ X-Line',
    fuel: 'Petrol',
    vehicleClass: 'Mid SUV',
    displacement: '1482cc Smartstream Turbo',
    city: 'Ahmedabad',
    state: 'Gujarat',
    zone: 'West',
    driver: 'Mehul Patel',
    fleetCompany: 'Rivigo Services Pvt Ltd',
    faultMode: 'Catalyst Efficiency Low',
    faultCode: 'P0420',
    prob: 0.64,
    coolant: 98.1,
    voltage: 13.6,
    rpm: 2600,
    speed: 90,
  },
  {
    plate: 'TS09QR9012',
    vin: 'MA1IGCDA1R702145',
    oem: 'Toyota',
    model: 'Innova Crysta 2.4 GX',
    fuel: 'Diesel',
    vehicleClass: 'MPV',
    displacement: '2393cc 2GD-FTV',
    city: 'Hyderabad',
    state: 'Telangana',
    zone: 'South',
    driver: 'Nagesh Reddy',
    fleetCompany: 'Gati-KWE Pvt Ltd',
    faultMode: 'Idle RPM High',
    faultCode: 'P0507',
    prob: 0.61,
    coolant: 91.5,
    voltage: 14.1,
    rpm: 1120,
    speed: 12,
  },
  {
    plate: 'WB02EF4529',
    vin: 'MA6THA2A6P829103',
    oem: 'Tata Motors',
    model: 'Harrier Fearless Dark',
    fuel: 'Diesel',
    vehicleClass: 'Mid SUV',
    displacement: '1956cc Kryotec',
    city: 'Kolkata',
    state: 'West Bengal',
    zone: 'East',
    driver: 'Dipankar Das',
    fleetCompany: 'Safexpress Pvt Ltd',
    faultMode: 'None',
    faultCode: '—',
    prob: 0.18,
    coolant: 88.0,
    voltage: 14.2,
    rpm: 1950,
    speed: 62,
  },
  {
    plate: 'KL07BP3901',
    vin: 'MA1IHYHA4R910248',
    oem: 'Toyota',
    model: 'Innova HyCross ZX(O)',
    fuel: 'Hybrid',
    vehicleClass: 'MPV',
    displacement: '1987cc TNGA Self-Charging',
    city: 'Kochi',
    state: 'Kerala',
    zone: 'South',
    driver: 'Arjun Nair',
    fleetCompany: 'VRL Logistics Ltd',
    faultMode: 'None',
    faultCode: '—',
    prob: 0.14,
    coolant: 86.4,
    voltage: 14.4,
    rpm: 1650,
    speed: 70,
  },
  {
    plate: 'RJ14CD8192',
    vin: 'MA7MTHDA2R381940',
    oem: 'Mahindra',
    model: 'Thar LX 4x4 Hardtop',
    fuel: 'Diesel',
    vehicleClass: 'Full SUV',
    displacement: '2184cc mHawk',
    city: 'Jaipur',
    state: 'Rajasthan',
    zone: 'West',
    driver: 'Rajesh Mishra',
    fleetCompany: 'Om Logistics Ltd',
    faultMode: 'None',
    faultCode: '—',
    prob: 0.22,
    coolant: 89.2,
    voltage: 13.9,
    rpm: 2100,
    speed: 52,
  },
  {
    plate: 'UP32HN7710',
    vin: 'MA3FGVHA8S419201',
    oem: 'Maruti Suzuki',
    model: 'Grand Vitara Alpha Hybrid',
    fuel: 'Hybrid',
    vehicleClass: 'Mid SUV',
    displacement: '1490cc Intelligent Electric',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    zone: 'North',
    driver: 'Rahul Sharma',
    fleetCompany: 'Ecom Express Pvt Ltd',
    faultMode: 'None',
    faultCode: '—',
    prob: 0.12,
    coolant: 87.1,
    voltage: 14.2,
    rpm: 1720,
    speed: 64,
  },
]

export const generateVehicles = (count = 280): Vehicle[] => {
  const result: Vehicle[] = []

  // Add all prominent handcrafted seeds first
  for (const s of PROMINENT_SEEDS) {
    const cat = VEHICLE_CATALOGUE.find(c => c.model === s.model) ?? VEHICLE_CATALOGUE[0]
    const fault = FAULT_MODES.find(f => f.code === s.faultCode) ?? {
      code: '—', label: 'None', desc: 'Operating nominal — no active diagnostic fault code',
      recommendedPart: 'Standard Scheduled Service', estSavingINR: 0, estRepairCostINR: 2400
    }
    const city = INDIAN_CITIES_DETAILED.find(c => c.name === s.city) ?? INDIAN_CITIES_DETAILED[0]

    result.push({
      plate: s.plate,
      vin: s.vin,
      oem: s.oem,
      model: s.model,
      fuel: s.fuel,
      vehicleClass: s.vehicleClass,
      displacement: s.displacement,
      fuelTankOrKwh: cat.fuelTankOrKwh,
      araiMileage: cat.araiMileage,
      year: ri(2021, 2024),
      colour: pick(COLOURS),
      fleetCompany: s.fleetCompany,
      driver: s.driver,
      driverPhone: `+91 ${ri(98100, 98999)} ${ri(10000, 99999)}`,
      driverBadge: `DL-${s.plate.slice(0, 2)}-${ri(2017, 2023)}-${ri(1000, 9999)}`,
      city: s.city,
      state: s.state,
      zone: s.zone,
      lat: +(city.lat + r(-0.06, 0.06)).toFixed(5),
      lon: +(city.lon + r(-0.06, 0.06)).toFixed(5),
      odometer: ri(12400, 168000),
      speed: s.speed,
      coolant: s.coolant,
      voltage: s.voltage,
      rpm: s.rpm,
      soh: s.fuel === 'EV' ? r(68, 92) : s.fuel === 'Hybrid' ? r(80, 98) : 100,
      dtcCount: s.prob > 0.7 ? ri(2, 6) : 0,
      faultMode: s.faultMode,
      faultCode: s.faultCode,
      faultDesc: fault.desc,
      prob: s.prob,
      severity: s.prob > 0.80 ? 'Critical' : s.prob > 0.60 ? 'High' : s.prob > 0.40 ? 'Medium' : 'Low',
      status: s.prob > 0.80 ? 'Depot Inspection' : s.speed > 5 ? 'Active En Route' : 'Idling',
      lastSeen: new Date(Date.now() - ri(30000, 300000)).toISOString(),
      fastagBalance: ri(1200, 8500),
      insurancePolicy: `HDFC-ERGO-FLT-${ri(100000, 999999)}`,
      insuranceExpiry: `2027-0${ri(1, 9)}-${ri(10, 28)}`,
      puccExpiry: `2026-1${ri(0, 2)}-${ri(10, 28)}`,
      savingsINR: fault.estSavingINR > 0 ? fault.estSavingINR : Math.max(0, Math.floor(s.prob * 52000 - 11000)),
    })
  }

  // Populate remaining vehicles across all states of India
  const targetCount = count - PROMINENT_SEEDS.length
  for (let i = 0; i < targetCount; i++) {
    const cat = pick(VEHICLE_CATALOGUE)
    // Distribute evenly across states so every state in India is represented
    const stateObj: IndianState = INDIAN_STATES[i % INDIAN_STATES.length]
    // Pick city in that state if available, else standard city
    const stateCity = INDIAN_CITIES_DETAILED.find(c => c.state === stateObj.code) ?? {
      name: stateObj.capital, state: stateObj.code, lat: 20.0 + r(-5, 5), lon: 78.0 + r(-5, 5), hub: `${stateObj.name} Depot`
    }

    const prob = r(0.04, 0.96)
    const hasFault = prob > 0.70
    const fault = hasFault ? pick(FAULT_MODES) : {
      code: '—', label: 'None', desc: 'Nominal operating conditions — zero active DTCs logged',
      recommendedPart: 'Scheduled Preventive Inspection', estSavingINR: 0, estRepairCostINR: 2500
    }

    // Realistic physical telemetry values conditioned on faults
    let coolant = r(82.0, 98.0)
    let voltage = r(13.5, 14.5)
    let rpm = ri(750, 3600)
    const speed = ri(0, 94)

    if (fault.code === 'P0217') {
      coolant = r(104.5, 118.2) // overheating
    } else if (fault.code === 'P0562') {
      voltage = r(10.8, 12.1) // voltage sag
    } else if (fault.code === 'P0507') {
      rpm = ri(1200, 1850) // high idle
    }

    const plate = generateLicensePlate(stateObj.code)
    const vin = generateVIN(cat.wmi, ri(2019, 2024))
    const driverName = INDIAN_DRIVER_NAMES[i % INDIAN_DRIVER_NAMES.length]

    result.push({
      plate,
      vin,
      oem: cat.make,
      model: cat.model,
      fuel: cat.fuel,
      vehicleClass: cat.vehicleClass,
      displacement: cat.displacement,
      fuelTankOrKwh: cat.fuelTankOrKwh,
      araiMileage: cat.araiMileage,
      year: ri(2018, 2024),
      colour: pick(COLOURS),
      fleetCompany: pick(FLEET_COMPANIES),
      driver: driverName,
      driverPhone: `+91 ${ri(98100, 98999)} ${ri(10000, 99999)}`,
      driverBadge: `DL-${stateObj.code}-${ri(2016, 2023)}-${ri(1000, 9999)}`,
      city: stateCity.name,
      state: stateObj.name,
      zone: stateObj.zone,
      lat: +(stateCity.lat + r(-0.08, 0.08)).toFixed(5),
      lon: +(stateCity.lon + r(-0.08, 0.08)).toFixed(5),
      odometer: ri(14000, 195000),
      speed,
      coolant: +coolant.toFixed(1),
      voltage: +voltage.toFixed(2),
      rpm,
      soh: cat.fuel === 'EV' ? r(65, 98) : cat.fuel === 'Hybrid' ? r(78, 100) : 100,
      dtcCount: prob > 0.70 ? ri(1, 5) : 0,
      faultMode: fault.label,
      faultCode: fault.code,
      faultDesc: fault.desc,
      prob,
      severity: prob > 0.80 ? 'Critical' : prob > 0.60 ? 'High' : prob > 0.40 ? 'Medium' : 'Low',
      status: prob > 0.82 ? 'Depot Inspection' : speed > 4 ? 'Active En Route' : speed === 0 && cat.fuel === 'EV' ? 'Fast Charging' : 'Idling',
      lastSeen: new Date(Date.now() - ri(10000, 720000)).toISOString(),
      fastagBalance: ri(850, 9800),
      insurancePolicy: `ICICI-LOMBARD-FLT-${ri(100000, 999999)}`,
      insuranceExpiry: `2027-0${ri(1, 9)}-${ri(10, 28)}`,
      puccExpiry: `2026-1${ri(0, 2)}-${ri(10, 28)}`,
      savingsINR: fault.estSavingINR > 0 ? fault.estSavingINR : Math.max(0, Math.floor(prob * 50000 - 10000)),
    })
  }

  return result
}

export const generateAlertsFromFleet = (vehicles: Vehicle[]) =>
  vehicles
    .filter(v => v.prob > 0.50)
    .slice(0, 60)
    .map((v, i) => ({
      id: `ALT-IND-${4000 + i}`,
      plate: v.plate,
      vin: v.vin,
      model: v.model,
      city: v.city,
      state: v.state,
      driver: v.driver,
      fleetCompany: v.fleetCompany,
      type: v.faultMode !== 'None' ? v.faultMode : 'Sliding Window Threshold Breach',
      faultCode: v.faultCode,
      severity: v.severity,
      prob: v.prob,
      coolant: v.coolant,
      voltage: v.voltage,
      ts: new Date(Date.now() - ri(60000, 14400000)).toISOString(),
      resolved: i > 12 && Math.random() > 0.62,
    }))

/* ── Export Singletons ── */
export const FLEET_VEHICLES = generateVehicles(300)
export const FLEET_ALERTS   = generateAlertsFromFleet(FLEET_VEHICLES)
export const FLEET_RISK_TOP = [...FLEET_VEHICLES].sort((a, b) => b.prob - a.prob).slice(0, 80)
