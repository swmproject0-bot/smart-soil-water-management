from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase_config import supabase

import pandas as pd
import joblib

# ==================================================
# FastAPI App
# ==================================================

app = FastAPI(
    title="Smart Soil Water Management API",
    version="1.0"
)

# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# Load ML Model
# ==================================================

model = joblib.load("crop_recommendation.pkl")
encoder = joblib.load("label_encoder.pkl")

# ==================================================
# Input Schema
# ==================================================

class CropInput(BaseModel):
    N: int
    P: int
    K: int
    temperature: float
    humidity: float
    ph: float
    rainfall: float

# ==================================================
# Home Route
# ==================================================

@app.get("/")
def home():
    return {
        "message": "Smart Soil Water Management API Running"
    }

# ==================================================
# Sensor Data Route
# ==================================================

@app.get("/sensor-data")
def sensor_data():

    return {
        "moisture": 35,
        "temperature": 28,
        "humidity": 72,
        "ph": 6.5,
        "N": 90,
        "P": 42,
        "K": 43
    }

# ==================================================
# Water Requirement Route
# ==================================================

@app.get("/water-requirement")
def water_requirement():

    moisture = 35

    if moisture < 30:
        water_required = 15
        priority = "High"

    elif moisture < 50:
        water_required = 8
        priority = "Medium"

    else:
        water_required = 2
        priority = "Low"

    return {
        "water_required_liters": water_required,
        "priority": priority
    }

# ==================================================
# Crop Prediction Route
# ==================================================

@app.post("/predict")
def predict(data: CropInput):

    try:

        features = pd.DataFrame([{
            "N": data.N,
            "P": data.P,
            "K": data.K,
            "temperature": data.temperature,
            "humidity": data.humidity,
            "ph": data.ph,
            "rainfall": data.rainfall
        }])

        prediction = model.predict(features)

        crop_name = encoder.inverse_transform(prediction)

        return {
            "recommended_crop": crop_name[0]
        }

    except Exception as e:

        return {
            "error": str(e)
        }

# ==================================================
# Pump Status Route
# ==================================================

@app.get("/pump-status")
def pump_status():

    moisture = 35

    if moisture < 30:
        status = "ON"
    else:
        status = "OFF"

    return {
        "pump_status": status
    }

# ==================================================
# Supabase Test Route
# ==================================================

@app.get("/test-supabase")
def test_supabase():

    response = supabase.table("soil_data").select("*").execute()

    return {
        "data": response.data
    }