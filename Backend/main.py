# =====================================
# Medical ML + QML Hybrid Backend
# =====================================

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

from auth import router as auth_router, get_current_user
from predict import hybrid_predict
from database import predictions_collection
from metrics import calculate_metrics

app = FastAPI(title="Medical Hybrid ML + QML API")

# =====================================
# CORS CONFIG
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


# =====================================
# REQUEST MODEL
# =====================================

class PredictRequest(BaseModel):
    age: float
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalch: float
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int


# =====================================
# HYBRID PREDICTION ROUTE
# =====================================

@app.post("/predict")
def predict(data: PredictRequest, user=Depends(get_current_user)):

    try:
        email = user["email"]
        full_input = data.dict()

        final_result, final_prob, q_prob, c_prob, explanation = hybrid_predict(full_input)

        predictions_collection.insert_one({
            "email": email,
            "inputs": full_input,
            "quantum_confidence": q_prob,
            "classical_confidence": c_prob,
            "final_prediction": final_result,
            "final_confidence": final_prob,
            "explanation": explanation,
            "created_at": datetime.utcnow()
        })

        return {
            "final_prediction": final_result,
            "final_confidence": final_prob,
            "quantum_confidence": q_prob,
            "classical_confidence": c_prob,
            "explanation": explanation
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================
# USER HISTORY
# =====================================

@app.get("/history")
def get_history(user=Depends(get_current_user)):

    return list(
        predictions_collection.find(
            {"email": user["email"]},
            {"_id": 0}
        )
    )


# =====================================
# ADMIN HISTORY
# =====================================

@app.get("/admin/history")
def get_all_history(user=Depends(get_current_user)):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    return list(predictions_collection.find({}, {"_id": 0}))


# =====================================
# METRICS
# =====================================

@app.get("/metrics")
def get_metrics():
    return calculate_metrics()


# =====================================
# ROOT
# =====================================

@app.get("/")
def home():
    return {
        "message": "Medical Hybrid ML + QML Backend Running 🚀"
    }