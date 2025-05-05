from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np

# Load the trained model
with open("lin_reg_model.pkl", "rb") as file:
    model = pickle.load(file)

# Initialize FastAPI app
app = FastAPI(title="Car Selling Price Prediction API 🚗")

# ✅ Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can also use ["http://localhost:3000"] to be more strict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input data schema using Pydantic
class CarFeatures(BaseModel):
    year: int
    present_price: float
    kms_driven: int
    fuel_type: str
    seller_type: str
    transmission: str
    owner: int

# Home route
@app.get("/")
def read_root():
    return {"message": "Welcome to the Car Selling Price Prediction API 🚗"}

# Prediction route
@app.post("/predict")
def predict_price(features: CarFeatures):
    try:
        # Manual encoding (same as you did before)
        fuel_type_encoded = 0 if features.fuel_type == "Petrol" else 1 if features.fuel_type == "Diesel" else 2
        seller_type_encoded = 0 if features.seller_type == "Dealer" else 1
        transmission_encoded = 0 if features.transmission == "Manual" else 1

        # Prepare feature array
        input_data = np.array([[features.year, features.present_price, features.kms_driven,
                                fuel_type_encoded, seller_type_encoded,
                                transmission_encoded, features.owner]])

        # Predict
        prediction = model.predict(input_data)[0]

        return {
            "estimated_selling_price_lakhs": round(prediction, 2)
        }
    except Exception as e:
        return {"error": str(e)}
