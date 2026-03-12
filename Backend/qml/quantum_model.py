import numpy as np
import pennylane as qml

# Number of qubits
n_qubits = 4

# Quantum device
dev = qml.device("default.qubit", wires=n_qubits)


# =========================
# FEATURE ENCODING
# =========================
def encode(x):
    for i in range(n_qubits):
        qml.RY(x[i], wires=i)


# =========================
# VARIATIONAL LAYER
# =========================
def variational(weights):

    for i in range(n_qubits):
        qml.RX(weights[i], wires=i)

    # entanglement
    for i in range(n_qubits - 1):
        qml.CNOT(wires=[i, i + 1])


# =========================
# QUANTUM CIRCUIT
# =========================
@qml.qnode(dev)
def quantum_circuit(x, weights):

    encode(x)
    variational(weights)

    return qml.expval(qml.PauliZ(0))


# =========================
# PREDICTION FUNCTION
# =========================
def quantum_predict(x, weights):

    x = np.array(x)

    # run circuit
    val = quantum_circuit(x, weights)

    # convert to probability
    prob = (val + 1) / 2

    if prob >= 0.5:
        return "Heart Disease", float(prob)
    else:
        return "No Heart Disease", float(prob)