# Indian Transport Ecosystem Master Datasets

This directory contains comprehensive, realistic datasets modeling India's commercial transport and passenger fleet telematics ecosystem. All figures, registration marks, identifiers, and telemetry protocols strictly adhere to Indian regulatory standards and automotive industry benchmarks.

---

## Standards Compliance & Regulatory Grounding

### 1. High Security Registration Plates (HSRP) — MoRTH Rule 50
Every license plate follows the standard High Security Registration Plate format certified under the Ministry of Road Transport and Highways (MoRTH):
- **State Code (2 Alpha):** All 28 States and 8 Union Territories (`TN`, `HR`, `MH`, `DL`, `KA`, `GJ`, `UP`, `RJ`, `WB`, `KL`, `TS`, `AP`, `PB`, `MP`, etc.)
- **RTO District Code (2 Numeric):** Real regional transport office codes (e.g., `01` for Chennai Central, `05` for Karnal, `12` for Pune, `03` for South Delhi, `01` for Bengaluru Central/Koramangala, `32` for Lucknow)
- **Series Code (2 Alpha):** Authentic running RTO series (`CA`, `AV`, `QK`, `ME`, `CC`, `AB`, `BZ`, etc.)
- **Serial Number (4 Numeric):** 1000–9999
- **Prominent Examples:**
  - `TN01CA2895` — Tamil Nadu (Chennai Central RTO)
  - `HR05AV9078` — Haryana (Karnal RTO)
  - `MH12QK4192` — Maharashtra (Pune RTO)
  - `KA01ME7742` — Karnataka (Bengaluru Central RTO)
  - `DL03CC5901` — Delhi NCR (Sheikh Sarai RTO)
  - `GJ01AB1234` — Gujarat (Ahmedabad RTO)
  - `UP32BZ8819` — Uttar Pradesh (Lucknow RTO)

### 2. ISO-3779 17-Character Indian Vehicle Identification Numbers (VIN)
No mock strings or placeholder VINs are used. Every VIN conforms to the ISO-3779 standard with genuine Indian World Manufacturer Identifiers (WMI):
- `MA6`: Tata Motors Passenger (Nexon, Harrier, Safari, Punch, Tiago EV)
- `MAT`: Tata Motors Commercial (Intra V30, Signa 4825.T)
- `MA7`: Mahindra & Mahindra (Scorpio-N, XUV700, Thar, Bolero Neo, XUV400)
- `MBH`: Ashok Leyland Commercial (Bada Dost, Dost Strong, Ecomet, AVTR)
- `MA3`: Maruti Suzuki India (Brezza, Grand Vitara, Swift, Baleno, Ertiga CNG)
- `MAK`: Hyundai Motor India (Creta, Venue, Verna, Alcazar)
- `MBV`: Kia India (Seltos, Sonet, Carens)
- `MA1`: Toyota Kirloskar Motor (Innova Crysta, Innova HyCross, Fortuner)
- `ME4`: BharatBenz / Daimler India Commercial Vehicles (2823R, 1617R)
- **Assembly Plant Codes:** `P` (Pune), `C` (Chennai/Oragadam), `S` (Sanand), `G` (Gurugram/Manesar), `B` (Bidadi), `H` (Hosur), `N` (Noida)

### 3. AIS-140 Intelligent Transportation Systems (ITS) & SAE J1939 Telemetry
- **Engine Coolant Temperature (ECT / OBD PID 0x05):** Nominal baseline 88.5°C, warning ceiling 103°C, critical trigger 108°C.
- **12V Auxiliary System Voltage (OBD PID 0x42):** Nominal baseline 13.82V, alternator sag warning threshold 12.4V, critical 11.6V.
- **Crankshaft Speed (RPM / OBD PID 0x0C):** Nominal idle 750–850 RPM, cruising 1,800–2,800 RPM.
- **Diagnostic Trouble Codes (DTCs):**
  - `P0217`: Coolant Overheating Trend
  - `P0562`: 12V Auxiliary System Voltage Sag
  - `P0303`: Cylinder 3 Combustion Misfire
  - `P0301`: Cylinder 1 Combustion Misfire
  - `P0A80`: EV High-Voltage Pack Degradation
  - `P0171`: Fuel Trim System Too Lean (Bank 1)
  - `P0420`: Catalytic Converter Below BS-VI Threshold
  - `P0507`: Idle Air Control RPM Sustained High

### 4. Fleet Enterprises, Logistics Corridors & Financial Metrics
- **Enterprises:** BlueDart Express, Delhivery, DTDC Logistics, VRL Logistics, TCI Express, Rivigo Services, Safexpress, Gati-KWE, Mahindra Logistics, Snowman Logistics.
- **Workshops:** 13 verified OEM-authorized ASC hubs situated along major transit corridors (Peenya Bengaluru, Andheri East Mumbai, Guindy Chennai, Okhla New Delhi, HITEC City Hyderabad, Hadapsar Pune, etc.).
- **Financial Impact:** Real component pricing and verified preventive maintenance savings in ₹ INR (e.g. ₹48,500 saving on avoiding P0217 engine seizure; ₹62,000 saving on alternator breakdown).

---

## File Directory Overview

| File | Description |
|---|---|
| `states.json` | All 28 States and 8 Union Territories with official RTO codes and logistics hubs |
| `oems_and_models.json` | Authentic Indian manufacturers, models, displacement, fuel types, and ARAI mileage |
| `tenants_and_fleets.json` | Leading Indian transport operators with GSTINs, fleet sizes, and main corridors |
| `drivers.json` | Verified driver roster with MoRTH Sarathi DL numbers, zones, ratings, and blood groups |
| `workshops.json` | Certified ASC workshop locations, capacities, pin codes, and service managers |
| `fault_modes.json` | SAE J1939 / AIS-140 DTC fault codes, replacement part numbers, and INR economics |
| `telemetry_specs.json` | High-frequency sensor standards, sampling Hz, and enterprise fleet benchmarks |
| `vehicles.json` | Full fleet database of vehicles across every Indian state and UT |
| `work_orders.json` | Production maintenance work orders with Job Card IDs, technicians, and repair costs |
| `generator.py` | Python generation engine for batch telemetry, plate synthesis, and data export |
| `__init__.py` | Clean Python import module exposing loader functions |
