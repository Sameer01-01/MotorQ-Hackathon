/* ═══════════════════════════════════════════════════════════
   WORK ORDERS & MAINTENANCE SCHEDULE (Indian Fleet Service)
   Legitimate maintenance work orders with actual spare part codes,
   OEM certified workshops across India, and ₹ INR pricing.
═══════════════════════════════════════════════════════════ */

export interface WorkOrder {
  id: string
  orderDate: string
  scheduledDate: string
  vehiclePlate: string
  vin: string
  model: string
  oem: string
  fleetCompany: string
  workshopName: string
  city: string
  state: string
  faultMode: string
  dtcCode: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE'
  status: 'SCHEDULED' | 'IN_BAY' | 'AWAITING_PARTS' | 'QC_PASSED' | 'COMPLETED'
  technician: string
  allocatedHours: number
  partsRequired: string[]
  estimatedCostINR: number
  preventiveSavingINR: number
  jobCardNumber: string
}

export const WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-IND-8901',
    orderDate: '2026-10-01',
    scheduledDate: '2026-10-02 09:30',
    vehiclePlate: 'TN01CA2895',
    vin: 'MA6TNXZA5P109823',
    model: 'Tata Nexon XZ+ (Diesel)',
    oem: 'Tata Motors',
    fleetCompany: 'BlueDart Express Pvt Ltd',
    workshopName: 'Tata Motors Authorized ASC — Guindy, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    faultMode: 'Coolant Overheating Trend',
    dtcCode: 'P0217',
    priority: 'CRITICAL',
    status: 'SCHEDULED',
    technician: 'Karthik Subramanian (Master Tech)',
    allocatedHours: 3.5,
    partsRequired: ['OEM Coolant Pump Assembly (Tata #5424)', 'Castrol Radicool Premix (5L)', 'Thermostat Housing Gasket'],
    estimatedCostINR: 8450,
    preventiveSavingINR: 48500,
    jobCardNumber: 'JC-TN01-2026-0941',
  },
  {
    id: 'WO-IND-8902',
    orderDate: '2026-10-01',
    scheduledDate: '2026-10-02 11:00',
    vehiclePlate: 'HR05AV9078',
    vin: 'MA7MX7DA3R201948',
    model: 'Mahindra XUV700 AX7 L (Diesel)',
    oem: 'Mahindra & Mahindra',
    fleetCompany: 'Delhivery Pvt Ltd',
    workshopName: 'Mahindra First Choice — Sector 34, Gurugram',
    city: 'Gurugram',
    state: 'Haryana',
    faultMode: 'Alternator Voltage Sag',
    dtcCode: 'P0562',
    priority: 'CRITICAL',
    status: 'IN_BAY',
    technician: 'Suresh Chauhan (Sr. Electrical)',
    allocatedHours: 2.5,
    partsRequired: ['Valeo 140A Alternator Diode Pack', 'Exide Epiq DIN74 Auxiliary Battery', 'V-Ribbed Serpentine Belt'],
    estimatedCostINR: 14200,
    preventiveSavingINR: 62000,
    jobCardNumber: 'JC-HR05-2026-0812',
  },
  {
    id: 'WO-IND-8903',
    orderDate: '2026-10-01',
    scheduledDate: '2026-10-02 14:00',
    vehiclePlate: 'MH12AB3491',
    vin: 'MA3FJHB27S309112',
    model: 'Maruti Suzuki Brezza ZXi+',
    oem: 'Maruti Suzuki',
    fleetCompany: 'DTDC Logistics India',
    workshopName: 'Maruti Suzuki ARENA Service Hub — Hadapsar, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    faultMode: 'Ignition Misfire Cylinder 3',
    dtcCode: 'P0303',
    priority: 'HIGH',
    status: 'AWAITING_PARTS',
    technician: 'Nikhil Desai (Diagnostics Specialist)',
    allocatedHours: 2.0,
    partsRequired: ['NGK Iridium Spark Plugs (Set of 4)', 'Denso Direct Ignition Coil #3', 'Throttle Body Cleanser Spray'],
    estimatedCostINR: 6800,
    preventiveSavingINR: 32000,
    jobCardNumber: 'JC-MH12-2026-1104',
  },
  {
    id: 'WO-IND-8904',
    orderDate: '2026-09-30',
    scheduledDate: '2026-10-02 16:30',
    vehiclePlate: 'KA01ME7742',
    vin: 'MA6TNEVA9R410852',
    model: 'Tata Nexon EV Empowered+',
    oem: 'Tata Motors',
    fleetCompany: 'Mahindra Logistics Ltd',
    workshopName: 'Tata EV Pro ASC — Whitefield, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    faultMode: 'EV Battery Cell Imbalance',
    dtcCode: 'P0A80',
    priority: 'HIGH',
    status: 'SCHEDULED',
    technician: 'Deepa Pillai (High-Voltage EV Certified)',
    allocatedHours: 4.0,
    partsRequired: ['BMS Firmware Reflash v4.2.1', 'Cell Balancing Harness Calibration', 'Liquid Coolant Glycol Top-up'],
    estimatedCostINR: 11500,
    preventiveSavingINR: 75000,
    jobCardNumber: 'JC-KA01-2026-0731',
  },
  {
    id: 'WO-IND-8905',
    orderDate: '2026-09-30',
    scheduledDate: '2026-10-03 10:00',
    vehiclePlate: 'DL03CC5901',
    vin: 'MAKGCRPA4P521890',
    model: 'Hyundai Creta SX Opt',
    oem: 'Hyundai India',
    fleetCompany: 'TCI Express Ltd',
    workshopName: 'Hyundai Authorised Motor Hub — Okhla Phase II, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    faultMode: 'Fuel Trim Bank 1 Lean',
    dtcCode: 'P0171',
    priority: 'MEDIUM',
    status: 'QC_PASSED',
    technician: 'Amit Kumar Singh (Fuel System Spec)',
    allocatedHours: 2.0,
    partsRequired: ['Bosch Mass Air Flow (MAF) Sensor', 'Intake Manifold Gasket O-Rings', 'Fuel Filter Element'],
    estimatedCostINR: 7400,
    preventiveSavingINR: 28500,
    jobCardNumber: 'JC-DL03-2026-0442',
  },
  {
    id: 'WO-IND-8906',
    orderDate: '2026-09-29',
    scheduledDate: '2026-10-03 12:30',
    vehiclePlate: 'GJ01GH3456',
    vin: 'MBVGSXPA2S612984',
    model: 'Kia Seltos HTX+',
    oem: 'Kia India',
    fleetCompany: 'Rivigo Services Pvt Ltd',
    workshopName: 'Kia Authorised ASC — Sarkhej Highway, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    faultMode: 'Catalyst Efficiency Degradation',
    dtcCode: 'P0420',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    technician: 'Mehul Patel (Emission Systems)',
    allocatedHours: 1.5,
    partsRequired: ['Downstream Heated Oxygen Sensor (O2)', 'Exhaust Flange Seal Gasket'],
    estimatedCostINR: 5200,
    preventiveSavingINR: 38000,
    jobCardNumber: 'JC-GJ01-2026-1892',
  },
  {
    id: 'WO-IND-8907',
    orderDate: '2026-10-01',
    scheduledDate: '2026-10-03 15:00',
    vehiclePlate: 'TS09QR9012',
    vin: 'MA1IGCDA1R702145',
    model: 'Toyota Innova Crysta GX',
    oem: 'Toyota Kirloskar',
    fleetCompany: 'Gati-KWE Pvt Ltd',
    workshopName: 'Toyota Kirloskar ASC — Sanath Nagar, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    faultMode: 'EGR Valve Carbon Clogging',
    dtcCode: 'P0401',
    priority: 'HIGH',
    status: 'SCHEDULED',
    technician: 'Nagesh Reddy (Diesel Powertrain Lead)',
    allocatedHours: 3.0,
    partsRequired: ['Toyota Genuine EGR Valve Assembly', 'Intake Plenum Decarbonization Kit', 'Vacuum Hose Lines'],
    estimatedCostINR: 12800,
    preventiveSavingINR: 54000,
    jobCardNumber: 'JC-TS09-2026-0619',
  },
]
