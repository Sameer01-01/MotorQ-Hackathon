from sqlmodel import SQLModel, create_engine, Session
import duckdb
import os

# SQLite setup (Relational Data)
DATABASE_URL = "sqlite:///./fleet_lite.db"
engine = create_engine(DATABASE_URL, echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# DuckDB setup (Historical Telemetry & Analytics)
def get_duckdb_conn():
    conn = duckdb.connect('./fleet_telemetry.duckdb')
    # Create the telemetry table if it doesn't exist
    conn.execute('''
        CREATE TABLE IF NOT EXISTS telemetry (
            tenant_id VARCHAR,
            vin VARCHAR,
            seq BIGINT,
            timestamp TIMESTAMP,
            coolant_temp DOUBLE,
            voltage DOUBLE,
            rpm DOUBLE,
            speed DOUBLE,
            odometer DOUBLE,
            dtcs VARCHAR[],
            latitude DOUBLE,
            longitude DOUBLE,
            oem VARCHAR,
            PRIMARY KEY (vin, seq)
        )
    ''')
    return conn
