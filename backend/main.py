# d:\Idbi\backend\main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import os

from backend.mock_data import MOCK_PROFILES
from backend.scoring_engine import compute_full_assessment

app = FastAPI(
    title="MSME Financial Health Card API",
    description="ULI/OCEN aligned alternative data-based credit evaluation engine.",
    version="0.9.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)

# Request Models
class WeightConfig(BaseModel):
    liquidity: float = Field(0.20, ge=0.0, le=1.0)
    stability: float = Field(0.20, ge=0.0, le=1.0)
    growth: float = Field(0.20, ge=0.0, le=1.0)
    compliance: float = Field(0.20, ge=0.0, le=1.0)
    repayment: float = Field(0.20, ge=0.0, le=1.0)

class ScoreRequest(BaseModel):
    profile_id: str
    weights: Optional[WeightConfig] = None

class CustomProfileRequest(BaseModel):
    profile_data: Dict[str, Any]
    weights: Optional[WeightConfig] = None

@app.get("/api/profiles")
def get_profiles():
    """
    Returns a list of all available mock profiles with metadata.
    """
    summary_profiles = []
    for k, v in MOCK_PROFILES.items():
        summary_profiles.append({
            "id": v["id"],
            "business_name": v["business_name"],
            "constitution": v["constitution"],
            "vintage_months": v["vintage_months"],
            "sector": v["sector"],
            "has_gst": v["gst"]["registered"],
            "has_upi": v["upi"]["active"],
            "has_aa": v["account_aggregator"]["linked"],
            "has_epfo": v["epfo"]["registered"]
        })
    return summary_profiles

@app.get("/api/profiles/{profile_id}")
def get_profile_details(profile_id: str):
    """
    Returns raw data details of a specific profile.
    """
    if profile_id not in MOCK_PROFILES:
        raise HTTPException(status_code=404, detail="Profile not found")
    return MOCK_PROFILES[profile_id]

@app.post("/api/score")
def evaluate_score(request: ScoreRequest):
    """
    Evaluates the MSME financial health score and SHAP values for a profile using current weights.
    """
    profile_id = request.profile_id
    if profile_id not in MOCK_PROFILES:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    weights_dict = request.weights.model_dump() if request.weights else None
    
    profile = MOCK_PROFILES[profile_id]
    result = compute_full_assessment(profile, weights=weights_dict)
    
    # Return structured assessment including a simulated ULI compliance wrapper
    return {
        "uli_payload_header": {
            "version": "1.0",
            "message_id": f"msg_{os.urandom(8).hex()}",
            "timestamp": "2026-07-05T10:50:00Z",
            "consent_ref": f"cns_{os.urandom(6).hex()}"
        },
        "assessment": result
    }

@app.post("/api/custom-score")
def evaluate_custom_score(request: CustomProfileRequest):
    """
    Evaluates a fully customized MSME profile (useful for simulator tuning).
    """
    weights_dict = request.weights.model_dump() if request.weights else None
    profile = request.profile_data
    
    # Validation helper
    required_keys = ["business_name", "constitution", "vintage_months", "sector", "gst", "upi", "account_aggregator", "epfo"]
    for k in required_keys:
        if k not in profile:
            raise HTTPException(status_code=400, detail=f"Missing key in profile data: {k}")
            
    result = compute_full_assessment(profile, weights=weights_dict)
    
    return {
        "uli_payload_header": {
            "version": "1.0",
            "message_id": f"msg_cust_{os.urandom(8).hex()}",
            "timestamp": "2026-07-05T10:50:00Z",
            "consent_ref": "cns_custom_flow"
        },
        "assessment": result
    }

@app.post("/api/consent/simulate")
def simulate_consent(data: Dict[str, Any]):
    """
    Simulates a consent flow step. Returns authorization and simulated data tokens.
    """
    entity_id = data.get("entity_id")
    consents = data.get("consents", []) # e.g. ["gst", "aa", "epfo", "upi"]
    
    if not entity_id:
        raise HTTPException(status_code=400, detail="Missing entity_id")
        
    return {
        "consent_id": f"consent_{os.urandom(8).hex()}",
        "status": "ACTIVE",
        "granted_by": entity_id,
        "consents_granted": consents,
        "expiry": "2026-07-12T10:50:00Z",
        "simulated_fip_data_keys": {c: f"fip_token_{os.urandom(4).hex()}" for c in consents}
    }

# Serving compiled React files if directory exists
dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="static")
else:
    @app.get("/")
    def read_root():
        return {
            "message": "Welcome to MSME Financial Health Card API. Frontend build files not detected. Please run frontend separately.",
            "api_docs": "/docs"
        }
