# ============================================
# QUANTUM MODEL TRAINING
# ============================================

import pandas as pd
import numpy as np
import joblib
import pennylane as qml
from pennylane import numpy as qnp
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# --------------------------------
# LOAD DATA
# --------------------------------
df = pd.read_csv("data/heart.csv")

QUANTUM_FEATURES = ["age", "chol", "thalch", "oldpeak"]

X = df[QUANTUM_FEATURES]
y = df["num"].apply(lambda x: 1 if x > 0 else 0)

# --------------------------------
# PREPROCESS
# --------------------------------
imputer_q = SimpleImputer(strategy="mean")
scaler_q = StandardScaler()

X = imputer_q.fit_transform(X)
X = scaler_q.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

X_train = qnp.array(X_train)
X_test = qnp.array(X_test)
y_train = qnp.array(y_train)
y_test = qnp.array(y_test)

# --------------------------------
# QUANTUM SETUP
# --------------------------------
n_qubits = 4
dev = qml.device("default.qubit", wires=n_qubits)

def encode(x):
    for i in range(n_qubits):
        qml.RY(x[i], wires=i)

def variational(weights):
    for i in range(n_qubits):
        qml.RX(weights[i], wires=i)
    for i in range(n_qubits - 1):
        qml.CNOT(wires=[i, i+1])

@qml.qnode(dev)
def circuit(x, weights):
    encode(x)
    variational(weights)
    return qml.expval(qml.PauliZ(0))

def loss(weights, X, y):
    preds = []
    for x in X:
        val = circuit(x, weights)
        prob = (val + 1) / 2
        preds.append(prob)
    preds = qnp.array(preds)
    return qnp.mean((preds - y) ** 2)

# --------------------------------
# TRAIN
# --------------------------------
weights = qnp.random.uniform(0, np.pi, n_qubits, requires_grad=True)
opt = qml.GradientDescentOptimizer(stepsize=0.2)

epochs = 20

for epoch in range(epochs):
    weights = opt.step(lambda w: loss(w, X_train[:50], y_train[:50]), weights)

# --------------------------------
# EVALUATE
# --------------------------------
def quantum_predict_batch(X, weights):
    preds = []
    for x in X:
        val = circuit(x, weights)
        prob = (val + 1) / 2
        preds.append(1 if prob >= 0.5 else 0)
    return qnp.array(preds)

y_pred = quantum_predict_batch(X_test[:50], weights)
print("Quantum Accuracy:", accuracy_score(y_test[:50], y_pred))

# --------------------------------
# SAVE
# --------------------------------
np.save("models/quantum_weights.npy", weights)
joblib.dump(imputer_q, "models/quantum_imputer.pkl")
joblib.dump(scaler_q, "models/quantum_scaler.pkl")

print("⚛️ Quantum Model Saved")