# =====================================
# MODEL PERFORMANCE METRICS
# =====================================

import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

from qml.quantum_model import quantum_predict


def calculate_metrics():

    # =========================
    # LOAD DATASET
    # =========================
    df = pd.read_csv("data/heart.csv")

    # Target column
    y = df["num"].apply(lambda x: 0 if x == 0 else 1)

    # Classical features (13)
    FEATURES = [
        "age",
        "sex",
        "cp",
        "trestbps",
        "chol",
        "fbs",
        "restecg",
        "thalch",
        "exang",
        "oldpeak",
        "slope",
        "ca",
        "thal"
    ]

    X = df[FEATURES]

    # =========================
    # LOAD MODELS
    # =========================
    model = joblib.load("models/classical_model.pkl")
    scaler = joblib.load("models/scaler.pkl")
    imputer = joblib.load("models/imputer.pkl")

    # Preprocess data
    X = imputer.transform(X)
    X = scaler.transform(X)

    # =========================
    # TRAIN TEST SPLIT
    # =========================
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

    # =========================
    # CLASSICAL METRICS
    # =========================
    y_pred_classical = model.predict(X_test)

    classical_metrics = {
        "accuracy": round(accuracy_score(y_test, y_pred_classical) * 100, 2),
        "precision": round(precision_score(y_test, y_pred_classical) * 100, 2),
        "recall": round(recall_score(y_test, y_pred_classical) * 100, 2),
        "f1_score": round(f1_score(y_test, y_pred_classical) * 100, 2)
    }

    # =========================
    # QUANTUM METRICS
    # =========================
    weights = np.load("models/quantum_weights.npy")

    y_pred_quantum = []

    for i in range(len(X_test)):

        # Only 4 features used in quantum model
        sample = [
            float(X_test[i][0]),   # age
            float(X_test[i][4]),   # chol
            float(X_test[i][7]),   # thalch
            float(X_test[i][9])    # oldpeak
        ]

        result, _ = quantum_predict(sample, weights)

        if result == "Heart Disease":
            y_pred_quantum.append(1)
        else:
            y_pred_quantum.append(0)

    y_pred_quantum = np.array(y_pred_quantum)

    quantum_metrics = {
        "accuracy": round(accuracy_score(y_test, y_pred_quantum) * 100, 2),
        "precision": round(precision_score(y_test, y_pred_quantum) * 100, 2),
        "recall": round(recall_score(y_test, y_pred_quantum) * 100, 2),
        "f1_score": round(f1_score(y_test, y_pred_quantum) * 100, 2)
    }

    # =========================
    # RETURN METRICS
    # =========================
    return {
        "classical": classical_metrics,
        "quantum": quantum_metrics
    }