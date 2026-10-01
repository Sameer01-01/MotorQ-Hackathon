from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Tenant(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    name: str

class AppUser(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    tenant_id: str = Field(foreign_key="tenant.id")
    email: str = Field(unique=True)
    hashed_password: str
    role: str # tenant_admin, fleet_manager, analyst, auditor

class Fleet(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    tenant_id: str = Field(foreign_key="tenant.id")
    name: str

class OEM(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    name: str # e.g. Tata Motors, Mahindra, Ashok Leyland, Maruti Suzuki

class VehicleModel(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    oem_id: str = Field(foreign_key="oem.id")
    name: str
    powertrain: str # ICE, EV, HYBRID

class Vehicle(SQLModel, table=True):
    vin: str = Field(primary_key=True)
    license_plate: Optional[str] = Field(default=None)
    fleet_id: str = Field(foreign_key="fleet.id")
    model_id: str = Field(foreign_key="vehiclemodel.id")
    year: int
    status: str = Field(default="active")
    
class Driver(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    tenant_id: str = Field(foreign_key="tenant.id")
    name: str
    license_number: str

class DriverAssignment(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    vin: str = Field(foreign_key="vehicle.vin")
    driver_id: str = Field(foreign_key="driver.id")
    start_time: datetime
    end_time: Optional[datetime] = None

class Alert(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    vin: str = Field(foreign_key="vehicle.vin")
    alert_type: str # Overheating, VoltageSag, Misfire, HarshBraking
    severity: str # Low, Medium, High, Critical
    timestamp: datetime
    resolved: bool = False

class Workshop(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    tenant_id: str = Field(foreign_key="tenant.id")
    name: str
    daily_capacity_hours: float
    latitude: float
    longitude: float

class Prediction(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    vin: str = Field(foreign_key="vehicle.vin")
    timestamp: datetime
    failure_probability: float
    top_reasons: str # JSON array of feature importance strings
    predicted_mode: str # Type of failure predicted

class AuditLog(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_id: str
    action: str
    details: str
    previous_hash: str
    current_hash: str
