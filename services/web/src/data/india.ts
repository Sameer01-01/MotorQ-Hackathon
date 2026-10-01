/* ═══════════════════════════════════════════════════════════
   INDIA MASTER DATA — All 28 States, 8 UTs, Cities, Drivers, Fleets
   Authentic Indian transport ecosystem parameters
═══════════════════════════════════════════════════════════ */

export interface IndianState {
  code: string
  name: string
  districts: number
  capital: string
  zone: 'North' | 'South' | 'West' | 'East' | 'Central' | 'NorthEast' | 'UT'
}

export const INDIAN_STATES: IndianState[] = [
  // South
  { code: 'TN', name: 'Tamil Nadu',        districts: 38, capital: 'Chennai',     zone: 'South' },
  { code: 'KA', name: 'Karnataka',         districts: 31, capital: 'Bengaluru',   zone: 'South' },
  { code: 'TS', name: 'Telangana',         districts: 33, capital: 'Hyderabad',   zone: 'South' },
  { code: 'AP', name: 'Andhra Pradesh',    districts: 26, capital: 'Amaravati',   zone: 'South' },
  { code: 'KL', name: 'Kerala',            districts: 14, capital: 'Thiruvananthapuram', zone: 'South' },
  
  // West
  { code: 'MH', name: 'Maharashtra',       districts: 36, capital: 'Mumbai',      zone: 'West' },
  { code: 'GJ', name: 'Gujarat',           districts: 33, capital: 'Gandhinagar', zone: 'West' },
  { code: 'GA', name: 'Goa',               districts: 2,  capital: 'Panaji',      zone: 'West' },
  { code: 'RJ', name: 'Rajasthan',         districts: 33, capital: 'Jaipur',      zone: 'West' },

  // North
  { code: 'DL', name: 'Delhi NCR',         districts: 11, capital: 'New Delhi',   zone: 'North' },
  { code: 'HR', name: 'Haryana',           districts: 22, capital: 'Chandigarh',  zone: 'North' },
  { code: 'PB', name: 'Punjab',            districts: 23, capital: 'Chandigarh',  zone: 'North' },
  { code: 'UP', name: 'Uttar Pradesh',     districts: 75, capital: 'Lucknow',     zone: 'North' },
  { code: 'UK', name: 'Uttarakhand',       districts: 13, capital: 'Dehradun',    zone: 'North' },
  { code: 'HP', name: 'Himachal Pradesh',  districts: 12, capital: 'Shimla',      zone: 'North' },
  { code: 'JK', name: 'Jammu & Kashmir',   districts: 20, capital: 'Srinagar',    zone: 'North' },
  { code: 'CH', name: 'Chandigarh',        districts: 1,  capital: 'Chandigarh',  zone: 'North' },
  { code: 'LA', name: 'Ladakh',            districts: 2,  capital: 'Leh',         zone: 'North' },

  // East & Central
  { code: 'WB', name: 'West Bengal',       districts: 23, capital: 'Kolkata',     zone: 'East' },
  { code: 'OR', name: 'Odisha',            districts: 30, capital: 'Bhubaneswar', zone: 'East' },
  { code: 'BR', name: 'Bihar',             districts: 38, capital: 'Patna',       zone: 'East' },
  { code: 'JH', name: 'Jharkhand',         districts: 24, capital: 'Ranchi',      zone: 'East' },
  { code: 'MP', name: 'Madhya Pradesh',    districts: 52, capital: 'Bhopal',      zone: 'Central' },
  { code: 'CG', name: 'Chhattisgarh',      districts: 33, capital: 'Raipur',      zone: 'Central' },

  // North East & UTs
  { code: 'AS', name: 'Assam',             districts: 35, capital: 'Dispur',      zone: 'NorthEast' },
  { code: 'ML', name: 'Meghalaya',         districts: 12, capital: 'Shillong',    zone: 'NorthEast' },
  { code: 'TR', name: 'Tripura',           districts: 8,  capital: 'Agartala',    zone: 'NorthEast' },
  { code: 'MN', name: 'Manipur',           districts: 16, capital: 'Imphal',      zone: 'NorthEast' },
  { code: 'MZ', name: 'Mizoram',           districts: 11, capital: 'Aizawl',      zone: 'NorthEast' },
  { code: 'NL', name: 'Nagaland',          districts: 16, capital: 'Kohima',      zone: 'NorthEast' },
  { code: 'AR', name: 'Arunachal Pradesh', districts: 26, capital: 'Itanagar',    zone: 'NorthEast' },
  { code: 'SK', name: 'Sikkim',            districts: 6,  capital: 'Gangtok',     zone: 'NorthEast' },
  { code: 'PY', name: 'Puducherry',        districts: 4,  capital: 'Puducherry',  zone: 'UT' },
  { code: 'DN', name: 'Dadra & Nagar Haveli', districts: 3, capital: 'Daman',     zone: 'UT' },
  { code: 'AN', name: 'Andaman & Nicobar', districts: 3, capital: 'Port Blair',   zone: 'UT' },
  { code: 'LD', name: 'Lakshadweep',       districts: 1, capital: 'Kavaratti',    zone: 'UT' },
]

export const INDIAN_CITIES_DETAILED = [
  { name: 'Chennai',          state: 'TN', lat: 13.0827, lon: 80.2707, hub: 'South Coastal Hub' },
  { name: 'Coimbatore',       state: 'TN', lat: 11.0168, lon: 76.9558, hub: 'Textile Corridor' },
  { name: 'Madurai',          state: 'TN', lat: 9.9252,  lon: 78.1198, hub: 'South Transit' },
  { name: 'Bengaluru',        state: 'KA', lat: 12.9716, lon: 77.5946, hub: 'Tech Corridor Hub' },
  { name: 'Mysuru',           state: 'KA', lat: 12.2958, lon: 76.6394, hub: 'South-West Transit' },
  { name: 'Hubballi',         state: 'KA', lat: 15.3647, lon: 75.1240, hub: 'North-KA Freight Hub' },
  { name: 'Hyderabad',        state: 'TS', lat: 17.3850, lon: 78.4867, hub: 'Deccan Central Hub' },
  { name: 'Warangal',         state: 'TS', lat: 17.9784, lon: 79.5941, hub: 'Telangana East' },
  { name: 'Visakhapatnam',    state: 'AP', lat: 17.6868, lon: 83.2185, hub: 'East Coast Port' },
  { name: 'Vijayawada',       state: 'AP', lat: 16.5062, lon: 80.6480, hub: 'Krishna Basin Hub' },
  { name: 'Kochi',            state: 'KL', lat: 9.9312,  lon: 76.2673, hub: 'Arabian Sea Port' },
  { name: 'Thiruvananthapuram', state: 'KL', lat: 8.5241, lon: 76.9366, hub: 'South Point' },
  { name: 'Mumbai',           state: 'MH', lat: 19.0760, lon: 72.8777, hub: 'Western Mega Hub' },
  { name: 'Pune',             state: 'MH', lat: 18.5204, lon: 73.8567, hub: 'Auto Cluster Hub' },
  { name: 'Nagpur',           state: 'MH', lat: 21.1458, lon: 79.0882, hub: 'Zero Mile Multi-Modal' },
  { name: 'Nashik',           state: 'MH', lat: 19.9975, lon: 73.7898, hub: 'North-MH Industrial' },
  { name: 'Ahmedabad',        state: 'GJ', lat: 23.0225, lon: 72.5714, hub: 'Gujarat Commercial Hub' },
  { name: 'Surat',            state: 'GJ', lat: 21.1702, lon: 72.8311, hub: 'Diamond City Freight' },
  { name: 'Vadodara',         state: 'GJ', lat: 22.3072, lon: 73.1812, hub: 'Chemical Corridor' },
  { name: 'Jaipur',           state: 'RJ', lat: 26.9124, lon: 75.7873, hub: 'North-West Express Hub' },
  { name: 'Jodhpur',          state: 'RJ', lat: 26.2389, lon: 73.0243, hub: 'Marwar Gateway' },
  { name: 'Delhi NCR',        state: 'DL', lat: 28.6139, lon: 77.2090, hub: 'Capital Region Mega Hub' },
  { name: 'Gurugram',         state: 'HR', lat: 28.4595, lon: 77.0266, hub: 'Cyber City Logistics' },
  { name: 'Faridabad',        state: 'HR', lat: 28.4089, lon: 77.3178, hub: 'Industrial Corridor' },
  { name: 'Ludhiana',         state: 'PB', lat: 30.9010, lon: 75.8573, hub: 'Punjab Freight Depot' },
  { name: 'Chandigarh',       state: 'CH', lat: 30.7333, lon: 76.7794, hub: 'Tri-City Transit' },
  { name: 'Noida',            state: 'UP', lat: 28.5355, lon: 77.3910, hub: 'Yamuna Expressway Hub' },
  { name: 'Lucknow',          state: 'UP', lat: 26.8467, lon: 80.9462, hub: 'Awadh Gateway' },
  { name: 'Kanpur',           state: 'UP', lat: 26.4499, lon: 80.3319, hub: 'Leather & Heavy Cargo' },
  { name: 'Kolkata',          state: 'WB', lat: 22.5726, lon: 88.3639, hub: 'Eastern Gateway Hub' },
  { name: 'Siliguri',         state: 'WB', lat: 26.7271, lon: 88.3953, hub: 'North-East Corridor' },
  { name: 'Bhubaneswar',      state: 'OR', lat: 20.2961, lon: 85.8245, hub: 'Odisha Mining & Coast' },
  { name: 'Patna',            state: 'BR', lat: 25.5941, lon: 85.1376, hub: 'Bihar Central Depot' },
  { name: 'Ranchi',           state: 'JH', lat: 23.3441, lon: 85.3096, hub: 'Chota Nagpur Hub' },
  { name: 'Indore',           state: 'MP', lat: 22.7196, lon: 75.8577, hub: 'Malwa Commercial Hub' },
  { name: 'Bhopal',           state: 'MP', lat: 23.2599, lon: 77.4126, hub: 'Bhopal Central Depot' },
  { name: 'Raipur',           state: 'CG', lat: 21.2514, lon: 81.6296, hub: 'Steel Corridor Hub' },
  { name: 'Guwahati',         state: 'AS', lat: 26.1445, lon: 91.7362, hub: 'Seven Sisters Hub' },
  { name: 'Dehradun',         state: 'UK', lat: 30.3165, lon: 78.0322, hub: 'Doon Valley Hub' },
  { name: 'Panaji',           state: 'GA', lat: 15.4909, lon: 73.8278, hub: 'Konkan Gateway' },
]

export const INDIAN_DRIVER_NAMES = [
  // South India
  'Karthik Subramanian', 'Arunachalam Murugan', 'Muthukumar Selvam', 'Revathi Sivakumar',
  'Suresh Iyer', 'Deepa Pillai', 'Arjun Nair', 'Priya Radhakrishnan', 'Venkat Raman',
  'Kavitha Sundaram', 'Rajesh Narayanan', 'Dinesh Kannan', 'Balaji Venkataraman',
  'Sowmya Ramachandran', 'Nagesh Reddy', 'Padma Rao', 'Srinivas Murthy', 'Usha Devi Gowda',
  // North India
  'Rahul Sharma', 'Amit Kumar Singh', 'Rajesh Mishra', 'Priya Gupta', 'Vijay Yadav',
  'Sandeep Tiwari', 'Rohit Pandey', 'Deepak Joshi', 'Manoj Rastogi', 'Suresh Chauhan',
  'Arun Tyagi', 'Vikash Goel', 'Sunita Devi', 'Pooja Verma', 'Neha Agarwal',
  'Harpreet Singh', 'Gurpreet Kaur', 'Manjinder Bhatia', 'Simran Bhullar', 'Ranjit Khanna',
  // West India
  'Mehul Patel', 'Jyoti Shah', 'Dhruv Mehta', 'Hetal Vora', 'Nikhil Desai',
  'Ravi Parmar', 'Kamlesh Solanki', 'Ketan Modi', 'Jayesh Nandha', 'Tejas Soni',
  'Sachin Kadam', 'Amol Deshmukh', 'Pradeep Shinde', 'Ganesh Jadhav', 'Swapnil Patil',
  // East India
  'Dipankar Das', 'Souvik Ghosh', 'Subhash Mondal', 'Avijit Mukherjee', 'Prosenjit Sen',
  'Tanushree Bose', 'Priti Roy', 'Arpita Chatterjee', 'Sujata Banerjee', 'Mitali Dutta',
  'Bikash Mohapatra', 'Satyajit Sahoo', 'Ranjan Pradhan', 'Anupama Samal', 'Debabrata Nayak',
  // Central & Pan-India
  'Abdul Rehman Khan', 'Mohammed Saleem', 'Farooq Abdullah', 'Tariq Anwar', 'Wasim Akram',
  'Anand Kapoor', 'Seema Malhotra', 'Indira Nair', 'Chandreshwar Prasad', 'Bipin Rawat',
]

export const FLEET_COMPANIES = [
  'BlueDart Express Pvt Ltd',
  'DTDC Logistics India',
  'Mahindra Logistics Ltd',
  'Delhivery Pvt Ltd',
  'TCI Express Ltd',
  'Rivigo Services Pvt Ltd',
  'Ecom Express Pvt Ltd',
  'VRL Logistics Ltd',
  'Safexpress Pvt Ltd',
  'Gati-KWE Pvt Ltd',
  'Om Logistics Ltd',
  'Transport Corporation of India',
  'Navkar Corporation Ltd',
  'Snowman Logistics Ltd',
  'Prayas Fleet Solutions',
  'IndoAsia Fleet Logistics',
]

export const SERVICE_WORKSHOPS = [
  { id: 'ws01', name: 'Ashok Leyland ASC — Peenya',          city: 'Bengaluru',  state: 'KA', capacity: 42, pincode: '560058', contact: '+91 80 2839 4101', head: 'R. Soundararajan' },
  { id: 'ws02', name: 'Tata Motors Authorised — Andheri East', city: 'Mumbai',     state: 'MH', capacity: 54, pincode: '400093', contact: '+91 22 2820 9940', head: 'Prashant Parab' },
  { id: 'ws03', name: 'Mahindra First Choice — Guindy',       city: 'Chennai',    state: 'TN', capacity: 38, pincode: '600032', contact: '+91 44 2235 1802', head: 'S. Ramalingam' },
  { id: 'ws04', name: 'Maruti Suzuki ARENA — Okhla Phase III',city: 'Delhi NCR',  state: 'DL', capacity: 48, pincode: '110020', contact: '+91 11 4161 8820', head: 'Vivek Malhotra' },
  { id: 'ws05', name: 'Bosch Service Bay — HITEC City',      city: 'Hyderabad',  state: 'TS', capacity: 40, pincode: '500081', contact: '+91 40 2311 7705', head: 'Venkat Rao' },
  { id: 'ws06', name: 'Hyundai Authorised — Sarkhej',         city: 'Ahmedabad',  state: 'GJ', capacity: 35, pincode: '382210', contact: '+91 79 2682 3311', head: 'Bhavesh Choksi' },
  { id: 'ws07', name: 'Toyota Kirloskar ASC — Hadapsar',      city: 'Pune',       state: 'MH', capacity: 36, pincode: '411028', contact: '+91 20 2687 4500', head: 'Mahesh Kulkarni' },
  { id: 'ws08', name: 'Kia Authorised Motor Hub — Whitefield',city: 'Bengaluru',  state: 'KA', capacity: 32, pincode: '560066', contact: '+91 80 6720 1200', head: 'Anand Kumar' },
  { id: 'ws09', name: 'Tata Motors EV Hub — Ambattur',       city: 'Chennai',    state: 'TN', capacity: 28, pincode: '600058', contact: '+91 44 2625 3300', head: 'E. Devaraj' },
  { id: 'ws10', name: 'Mahindra First Choice — Sec 34',       city: 'Gurugram',   state: 'HR', capacity: 30, pincode: '122001', contact: '+91 124 400 9820', head: 'Satish Tanwar' },
  { id: 'ws11', name: 'Maruti Suzuki Commercial — Dankuni',   city: 'Kolkata',    state: 'WB', capacity: 44, pincode: '712311', contact: '+91 33 2659 1100', head: 'Subrata Mukherjee' },
  { id: 'ws12', name: 'Ashok Leyland ASC — Sanath Nagar',     city: 'Hyderabad',  state: 'TS', capacity: 36, pincode: '500018', contact: '+91 40 2370 4422', head: 'Chandra Shekar' },
  { id: 'ws13', name: 'Bosch Diesel Center — Transport Nagar',city: 'Jaipur',     state: 'RJ', capacity: 26, pincode: '302004', contact: '+91 141 260 5510', head: 'Kishore Shekhawat' },
  { id: 'ws14', name: 'Toyota Kirloskar ASC — Hebbal',        city: 'Bengaluru',  state: 'KA', capacity: 34, pincode: '560024', contact: '+91 80 2362 7700', head: 'Gopal Krishna' },
  { id: 'ws15', name: 'Tata Authorised ASC — Alambagh',       city: 'Lucknow',    state: 'UP', capacity: 30, pincode: '226005', contact: '+91 522 245 8890', head: 'Rajeev Srivastava' },
]

export interface VehicleModelMeta {
  make: string
  model: string
  fuel: 'Petrol' | 'Diesel' | 'EV' | 'CNG' | 'Hybrid'
  wmi: string // Official Indian WMI code
  displacement: string
  vehicleClass: 'Hatchback' | 'Sedan' | 'Compact SUV' | 'Mid SUV' | 'Full SUV' | 'MPV' | 'Light Commercial'
  fuelTankOrKwh: string
  araiMileage: string
}

export const VEHICLE_CATALOGUE: VehicleModelMeta[] = [
  // Tata Motors (WMI: MA6 for passenger, MAT for commercial)
  { make: 'Tata Motors',   model: 'Nexon XZ+ (Diesel)',       fuel: 'Diesel', wmi: 'MA6TNXZA', displacement: '1497cc Turbo', vehicleClass: 'Compact SUV',   fuelTankOrKwh: '44 L', araiMileage: '23.2 km/l' },
  { make: 'Tata Motors',   model: 'Nexon EV Empowered+',      fuel: 'EV',     wmi: 'MA6TNEVA', displacement: 'Permanent Magnet AC', vehicleClass: 'Compact SUV', fuelTankOrKwh: '40.5 kWh', araiMileage: '465 km' },
  { make: 'Tata Motors',   model: 'Harrier Fearless Dark',    fuel: 'Diesel', wmi: 'MA6THA2A', displacement: '1956cc Kryotec', vehicleClass: 'Mid SUV',      fuelTankOrKwh: '50 L', araiMileage: '16.8 km/l' },
  { make: 'Tata Motors',   model: 'Safari Accomplished 6S',   fuel: 'Diesel', wmi: 'MA6TSFA1', displacement: '1956cc Kryotec', vehicleClass: 'Full SUV',     fuelTankOrKwh: '50 L', araiMileage: '16.1 km/l' },
  { make: 'Tata Motors',   model: 'Punch Creative (Petrol)',  fuel: 'Petrol', wmi: 'MA6TPNA1', displacement: '1199cc Revotron', vehicleClass: 'Compact SUV', fuelTankOrKwh: '37 L', araiMileage: '20.1 km/l' },
  { make: 'Tata Motors',   model: 'Punch EV Long Range',      fuel: 'EV',     wmi: 'MA6TPEA1', displacement: 'Liquid Cooled Permanent Magnet', vehicleClass: 'Compact SUV', fuelTankOrKwh: '35 kWh', araiMileage: '421 km' },
  { make: 'Tata Motors',   model: 'Tiago EV XZ+ Tech Lux',    fuel: 'EV',     wmi: 'MA6TTIE1', displacement: 'Permanent Magnet AC', vehicleClass: 'Hatchback', fuelTankOrKwh: '24 kWh', araiMileage: '315 km' },
  
  // Mahindra & Mahindra (WMI: MA7)
  { make: 'Mahindra',      model: 'Scorpio-N Z8 L 4XPLOR',    fuel: 'Diesel', wmi: 'MA7MSNZA', displacement: '2184cc mHawk', vehicleClass: 'Full SUV',     fuelTankOrKwh: '57 L', araiMileage: '15.4 km/l' },
  { make: 'Mahindra',      model: 'XUV700 AX7 L AWD',         fuel: 'Diesel', wmi: 'MA7MX7DA', displacement: '2184cc mHawk CRDe', vehicleClass: 'Full SUV', fuelTankOrKwh: '60 L', araiMileage: '16.6 km/l' },
  { make: 'Mahindra',      model: 'Thar LX 4x4 Hardtop',      fuel: 'Diesel', wmi: 'MA7MTHDA', displacement: '2184cc mHawk', vehicleClass: 'Full SUV',     fuelTankOrKwh: '57 L', araiMileage: '15.2 km/l' },
  { make: 'Mahindra',      model: 'Bolero Neo N10 (O)',       fuel: 'Diesel', wmi: 'MA7MBLDA', displacement: '1493cc mHawk75', vehicleClass: 'Mid SUV',     fuelTankOrKwh: '50 L', araiMileage: '17.3 km/l' },
  { make: 'Mahindra',      model: 'XUV300 W8 (O) Turbo',      fuel: 'Petrol', wmi: 'MA7MX3PA', displacement: '1197cc TGDi',  vehicleClass: 'Compact SUV',   fuelTankOrKwh: '42 L', araiMileage: '18.2 km/l' },
  { make: 'Mahindra',      model: 'XUV400 EV Pro',            fuel: 'EV',     wmi: 'MA7MX4EA', displacement: 'PSMS Synchronous', vehicleClass: 'Compact SUV', fuelTankOrKwh: '39.4 kWh', araiMileage: '456 km' },

  // Maruti Suzuki (WMI: MA3)
  { make: 'Maruti Suzuki', model: 'Brezza ZXi+ Dual Tone',    fuel: 'Petrol', wmi: 'MA3FJHB2', displacement: '1462cc K15C Smart Hybrid', vehicleClass: 'Compact SUV', fuelTankOrKwh: '48 L', araiMileage: '19.8 km/l' },
  { make: 'Maruti Suzuki', model: 'Grand Vitara Alpha Hybrid',fuel: 'Hybrid', wmi: 'MA3FGVHA', displacement: '1490cc Intelligent Electric', vehicleClass: 'Mid SUV', fuelTankOrKwh: '45 L', araiMileage: '27.9 km/l' },
  { make: 'Maruti Suzuki', model: 'Swift ZXi+ AMT',           fuel: 'Petrol', wmi: 'MA3ERLF1', displacement: '1197cc Z-Series Dual Jet', vehicleClass: 'Hatchback', fuelTankOrKwh: '37 L', araiMileage: '25.7 km/l' },
  { make: 'Maruti Suzuki', model: 'Baleno Alpha AGS',         fuel: 'Petrol', wmi: 'MA3FJEB1', displacement: '1197cc K12N DualJet', vehicleClass: 'Hatchback', fuelTankOrKwh: '37 L', araiMileage: '22.9 km/l' },
  { make: 'Maruti Suzuki', model: 'Ertiga ZXi (O) CNG',       fuel: 'CNG',    wmi: 'MA3FKGB3', displacement: '1462cc K15C Factory CNG', vehicleClass: 'MPV', fuelTankOrKwh: '60 L (CNG)', araiMileage: '26.1 km/kg' },
  { make: 'Maruti Suzuki', model: 'Dzire ZXi+ AMT',           fuel: 'Petrol', wmi: 'MA3EYID1', displacement: '1197cc DualJet', vehicleClass: 'Sedan', fuelTankOrKwh: '37 L', araiMileage: '24.1 km/l' },

  // Hyundai Motor India (WMI: MAK)
  { make: 'Hyundai',       model: 'Creta SX(O) Knight Edition',fuel: 'Petrol', wmi: 'MAKGCRPA', displacement: '1497cc MPi', vehicleClass: 'Mid SUV', fuelTankOrKwh: '50 L', araiMileage: '17.4 km/l' },
  { make: 'Hyundai',       model: 'Venue SX Opt Turbo DCT',   fuel: 'Petrol', wmi: 'MAKGVNPA', displacement: '998cc Kappa Turbo', vehicleClass: 'Compact SUV', fuelTankOrKwh: '45 L', araiMileage: '18.3 km/l' },
  { make: 'Hyundai',       model: 'Verna SX(O) 1.5 Turbo',    fuel: 'Petrol', wmi: 'MAKGVRPA', displacement: '1482cc GDi Turbo', vehicleClass: 'Sedan', fuelTankOrKwh: '45 L', araiMileage: '20.6 km/l' },
  { make: 'Hyundai',       model: 'i20 Asta(O) IVT',          fuel: 'Petrol', wmi: 'MAKGI2PA', displacement: '1197cc Kappa', vehicleClass: 'Hatchback', fuelTankOrKwh: '37 L', araiMileage: '19.6 km/l' },
  { make: 'Hyundai',       model: 'Alcazar Signature 6S',     fuel: 'Diesel', wmi: 'MAKGALDA', displacement: '1493cc U2 CRDi', vehicleClass: 'Full SUV', fuelTankOrKwh: '50 L', araiMileage: '20.4 km/l' },

  // Kia India (WMI: MBV)
  { make: 'Kia',           model: 'Seltos GTX+ X-Line',       fuel: 'Petrol', wmi: 'MBVGSXPA', displacement: '1482cc Smartstream Turbo', vehicleClass: 'Mid SUV', fuelTankOrKwh: '50 L', araiMileage: '17.9 km/l' },
  { make: 'Kia',           model: 'Sonet HTX+ AT',            fuel: 'Diesel', wmi: 'MBVGSNDA', displacement: '1493cc CRDi VGT', vehicleClass: 'Compact SUV', fuelTankOrKwh: '45 L', araiMileage: '19.0 km/l' },
  { make: 'Kia',           model: 'Carens Luxury Plus 7S',    fuel: 'Diesel', wmi: 'MBVGCRDA', displacement: '1493cc CRDi', vehicleClass: 'MPV', fuelTankOrKwh: '45 L', araiMileage: '21.3 km/l' },

  // Toyota Kirloskar (WMI: MA1)
  { make: 'Toyota',        model: 'Innova Crysta 2.4 GX',     fuel: 'Diesel', wmi: 'MA1IGCDA', displacement: '2393cc 2GD-FTV', vehicleClass: 'MPV', fuelTankOrKwh: '55 L', araiMileage: '15.1 km/l' },
  { make: 'Toyota',        model: 'Innova HyCross ZX(O)',     fuel: 'Hybrid', wmi: 'MA1IHYHA', displacement: '1987cc TNGA 5th Gen Self-Charging', vehicleClass: 'MPV', fuelTankOrKwh: '52 L', araiMileage: '23.2 km/l' },
  { make: 'Toyota',        model: 'Fortuner Legender 4x4',    fuel: 'Diesel', wmi: 'MA1IFLDA', displacement: '2755cc 1GD-FTV', vehicleClass: 'Full SUV', fuelTankOrKwh: '80 L', araiMileage: '14.2 km/l' },
  { make: 'Toyota',        model: 'Urban Cruiser Hyryder V',  fuel: 'Hybrid', wmi: 'MA1IHYRA', displacement: '1490cc Strong Hybrid', vehicleClass: 'Mid SUV', fuelTankOrKwh: '45 L', araiMileage: '27.9 km/l' },

  // Honda Cars India (WMI: MRH)
  { make: 'Honda',         model: 'City ZX e:HEV Hybrid',     fuel: 'Hybrid', wmi: 'MRHGCYPA', displacement: '1498cc Atkinson Cycle i-MMD', vehicleClass: 'Sedan', fuelTankOrKwh: '40 L', araiMileage: '27.1 km/l' },
  { make: 'Honda',         model: 'Elevate ZX CVT',           fuel: 'Petrol', wmi: 'MRHGELPA', displacement: '1498cc i-VTEC', vehicleClass: 'Mid SUV', fuelTankOrKwh: '40 L', araiMileage: '16.9 km/l' },

  // Commercial / Ashok Leyland & Tata Light Commercial
  { make: 'Ashok Leyland', model: 'Bada Dost i4',             fuel: 'Diesel', wmi: 'MBHBDST4', displacement: '1478cc Turbo Intercooled', vehicleClass: 'Light Commercial', fuelTankOrKwh: '50 L', araiMileage: '15.8 km/l' },
  { make: 'Tata Motors',   model: 'Intra V30 Smart Pick-up',  fuel: 'Diesel', wmi: 'MATINT30', displacement: '1497cc DI', vehicleClass: 'Light Commercial', fuelTankOrKwh: '35 L', araiMileage: '17.6 km/l' },
]

const POPULAR_SERIES = [
  'CA','CB','CC','CD','CE','CF','CG','CH','CJ','CK','CL','CM','CN','CP','CR','CS','CT','CU','CV','CW','CX','CY','CZ',
  'AV','AW','AX','AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BJ','BK','BL','BM','BN','BP','BR','BS','BT','BU',
  'AA','AB','AC','AD','AE','AF','AG','AH','AJ','AK','AL','AM','AN','AP','AR','AS','AT','AU',
  'DA','DB','DC','DD','DE','DF','DG','DH','DJ','DK','DL','DM','DN','DP','DR','DS','DT','DU','DV','DW','DX','DY','DZ',
  'EA','EB','EC','ED','EE','EF','EG','EH','EJ','EK','EL','EM','EN','EP','ER','ES','ET','EU','EV','EW','EX','EY','EZ',
  'FA','FB','FC','FD','FE','FF','FG','FH','FJ','FK','FL','FM','FN','FP','FR','FS','FT','FU','FV','FW','FX','FY','FZ',
]

/**
 * Generates an authentic Indian license plate format:
 * e.g. TN01CA2895, HR05AV9078, MH12QK4192, DL03CC5901, KA01ME7742
 */
export const generateLicensePlate = (stateCode?: string, district?: number): string => {
  const state = stateCode
    ? INDIAN_STATES.find(s => s.code === stateCode) ?? INDIAN_STATES[0]
    : INDIAN_STATES[Math.floor(Math.random() * INDIAN_STATES.length)]
  
  const distNum = district !== undefined
    ? String(district).padStart(2, '0')
    : String(Math.floor(Math.random() * Math.min(state.districts, 75)) + 1).padStart(2, '0')
  
  const series = POPULAR_SERIES[Math.floor(Math.random() * POPULAR_SERIES.length)]
  const num = String(Math.floor(Math.random() * 8999) + 1000)
  return `${state.code}${distNum}${series}${num}`
}

/**
 * Generates a realistic ISO-3779 compliant 17-character VIN with genuine Indian WMI code
 */
export const generateVIN = (wmiPrefix: string, year = 2024): string => {
  const vdsChars = '123456789ABCDEFGHJKLMNPRSTUVWXYZ'
  const vds = Array.from({ length: 5 }, () => vdsChars[Math.floor(Math.random() * vdsChars.length)]).join('')
  
  const yearCodeMap: Record<number, string> = {
    2018: 'J', 2019: 'K', 2020: 'L', 2021: 'M', 2022: 'N', 2023: 'P', 2024: 'R', 2025: 'S', 2026: 'T'
  }
  const yearChar = yearCodeMap[year] ?? 'R'
  
  // Real plant codes in India: P (Pune), C (Chennai), S (Sanand), G (Gurugram/Manesar), B (Bidadi), N (Noida)
  const plantCodes = ['P', 'C', 'S', 'G', 'B', 'N', 'A', 'H']
  const plantChar = plantCodes[Math.floor(Math.random() * plantCodes.length)]
  
  const seq = String(Math.floor(Math.random() * 899999) + 100000)
  const full = `${wmiPrefix.slice(0, 3)}${vds}4${yearChar}${plantChar}${seq}`
  return full.slice(0, 17)
}
