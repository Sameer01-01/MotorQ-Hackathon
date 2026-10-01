import asyncio
import time
from datetime import datetime
from services.api.database import get_duckdb_conn, engine as sql_engine
from sqlmodel import Session
from services.pipeline.rules import RuleEngine
import pandas as pd

# Simple in-memory deduplication set (in a real system, use Redis or Bloom filter)
seen_events = set()

def normalize_payload(raw_event: dict) -> dict:
    oem = raw_event.get("oem")
    if oem in ["Tata Motors", "Aurora"]:
        return {
            "tenant_id": "demo",
            "vin": raw_event["vehicleId"],
            "seq": raw_event["sequence"],
            "timestamp": datetime.fromtimestamp(raw_event["timestampMs"]/1000.0),
            "coolant_temp": raw_event["data"]["coolantC"],
            "voltage": raw_event["data"]["batV"],
            "rpm": raw_event["data"].get("rpm", 0.0),
            "speed": raw_event["data"]["spd"],
            "odometer": raw_event["data"].get("odometer", 0.0),
            "latitude": raw_event["data"]["loc"][1],
            "longitude": raw_event["data"]["loc"][0],
            "dtcs": raw_event["data"].get("faults", []),
            "oem": "Tata Motors"
        }
    elif oem in ["Mahindra", "Borealis"]:
        # Extract from Signals array
        sigs = {s["id"]: s["v"] for s in raw_event["Signals"]}
        return {
            "tenant_id": "demo",
            "vin": raw_event["VIN"],
            "seq": raw_event["seqNo"],
            "timestamp": datetime.fromisoformat(raw_event["Time_ISO"].replace('Z', '+00:00')),
            "coolant_temp": sigs.get("0x02", 0.0),
            "voltage": sigs.get("0x03", 0.0),
            "rpm": 0.0,
            "speed": sigs.get("0x01", 0.0),
            "odometer": 0.0,
            "latitude": raw_event["GPS_Lat"],
            "longitude": raw_event["GPS_Lon"],
            "dtcs": raw_event.get("DTC_List", []),
            "oem": "Mahindra"
        }
    elif oem in ["Ashok Leyland", "Cirrus"]:
        raw_temp = raw_event["temp"]
        # Convert if sent in Fahrenheit, else retain Celsius
        coolant = (raw_temp - 32) * 5/9 if raw_temp > 150 else raw_temp
        return {
            "tenant_id": "demo",
            "vin": raw_event["id"],
            "seq": raw_event["s"],
            "timestamp": datetime.fromtimestamp(raw_event["ts"]),
            "coolant_temp": coolant,
            "voltage": raw_event["volt"],
            "rpm": 0.0,
            "speed": raw_event["v"],
            "odometer": 0.0,
            "latitude": raw_event["lat"],
            "longitude": raw_event["lon"],
            "dtcs": raw_event.get("diag", []),
            "oem": "Ashok Leyland"
        }
    return None

async def stream_consumer(queue: asyncio.Queue):
    conn = get_duckdb_conn()
    batch = []
    batch_size = 500
    
    print("Stream consumer started.")
    
    rule_engine = RuleEngine()
    
    with Session(sql_engine) as session:
        while True:
            try:
                # Wait for event
                raw_event = await queue.get()
                
                # Normalize
                canon = normalize_payload(raw_event)
                if not canon:
                    queue.task_done()
                    continue
                    
                # Dedup
                dedup_key = f"{canon['vin']}_{canon['seq']}"
                if dedup_key in seen_events:
                    # Dropping duplicate
                    queue.task_done()
                    continue
                
                seen_events.add(dedup_key)
                if len(seen_events) > 1000000:
                    seen_events.clear() # Cache eviction threshold to maintain optimal working memory set
                    
                # Run Real-time rules (e.g. alerts)
                new_alerts = rule_engine.process_event(canon, session)
                if new_alerts:
                    print(f"Triggered {len(new_alerts)} alerts!")
                
                batch.append(canon)
                
                if len(batch) >= batch_size:
                    # Flush to DuckDB
                    df = pd.DataFrame(batch)
                    conn.execute("INSERT INTO telemetry SELECT * FROM df")
                    batch = []
                
                queue.task_done()
            except Exception as e:
                print(f"Consumer error: {e}")
                await asyncio.sleep(1)
