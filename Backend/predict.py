# =========================
# START predict.py
# =========================

import numpy as np
import pandas as pd
import joblib
import pennylane as qml

# LOAD MODELS
classical_model = joblib.load("models/classical_model.pkl")
classical_imputer = joblib.load("models/classical_imputer.pkl")
classical_scaler = joblib.load("models/classical_scaler.pkl")
classical_feature_names = joblib.load("models/classical_feature_names.pkl")

quantum_weights = np.load("models/quantum_weights.npy")
quantum_imputer = joblib.load("models/quantum_imputer.pkl")
quantum_scaler = joblib.load("models/quantum_scaler.pkl")

# QUANTUM SETUP
n_qubits = 4
dev = qml.device("default.qubit", wires=n_qubits)

@qml.qnode(dev)
def circuit(x, weights):

    for i in range(4):
        qml.RY(x[i], wires=i)

    for i in range(4):
        qml.RX(weights[i], wires=i)

    for i in range(3):
        qml.CNOT(wires=[i, i + 1])

    return qml.expval(qml.PauliZ(0))


# AI EXPLANATION FUNCTION
def explain_prediction(data):

    explanations = []

    if data["chol"] > 240:
        explanations.append("High Cholesterol")

    if data["oldpeak"] > 2:
        explanations.append("High ST Depression (Oldpeak)")

    if data["thalch"] < 120:
        explanations.append("Low Maximum Heart Rate")

    if data["cp"] >= 2:
        explanations.append("Abnormal Chest Pain Type")

    if data["trestbps"] > 140:
        explanations.append("High Blood Pressure")

    if data["ca"] >= 1:
        explanations.append("Blocked Major Vessels")

    if len(explanations) == 0:
        explanations.append("No major abnormal indicators detected")

    return explanations


# HYBRID PREDICTION
def hybrid_predict(full_input: dict):

    # -----------------------------
    # QUANTUM FEATURES (4 FEATURES)
    # -----------------------------
    q_input = [
        full_input["age"],
        full_input["chol"],
        full_input["thalch"],
        full_input["oldpeak"]
    ]

    q_input = np.array(q_input).reshape(1, -1)

    q_input = quantum_imputer.transform(q_input)
    q_input = quantum_scaler.transform(q_input)[0]

    q_val = circuit(q_input, quantum_weights)

    q_prob = float((q_val + 1) / 2)

    # -----------------------------
    # CLASSICAL FEATURES (ALL FEATURES)
    # -----------------------------
    classical_raw = {
        "sex": full_input["sex"],
        "cp": full_input["cp"],
        "trestbps": full_input["trestbps"],
        "fbs": full_input["fbs"],
        "restecg": full_input["restecg"],
        "exang": full_input["exang"],
        "slope": full_input["slope"],
        "ca": full_input["ca"],
        "thal": full_input["thal"],
    }

    df = pd.DataFrame([classical_raw])

    df = pd.DataFrame(
        classical_imputer.transform(df),
        columns=df.columns
    )

    df = pd.get_dummies(df)

    # Ensure same feature order
    for col in classical_feature_names:
        if col not in df.columns:
            df[col] = 0

    df = df[classical_feature_names]

    df_scaled = classical_scaler.transform(df)

    c_prob = float(classical_model.predict_proba(df_scaled)[0][1])

    # -----------------------------
    # HYBRID FUSION (IMPROVED)
    # -----------------------------

    # Weighted combination
    final_prob = (0.7 * c_prob) + (0.3 * q_prob)

    # Improved threshold
    if final_prob >= 0.55:
        final_result = "Heart Disease"
    else:
        final_result = "No Heart Disease"

    # Explanation
    explanation = explain_prediction(full_input)

    return final_result, final_prob, q_prob, c_prob, explanation


# =========================
# END predict.py
# =========================