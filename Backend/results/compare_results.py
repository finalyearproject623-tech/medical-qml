# =================================================
# STEP 10: CLASSICAL vs QUANTUM MODEL COMPARISON
# =================================================

import json
from datetime import datetime

# =================================================
# HARD-CODED RESULTS (FROM STEP 9 OUTPUTS)
# =================================================
# Classical ML Accuracy (from Logistic Regression)
classical_accuracy = 0.60

# Quantum ML Accuracy (from Hybrid QML)
quantum_accuracy = 0.47

# =================================================
# RESULT SUMMARY
# =================================================
results = {
    "project": "Medical Quantum Machine Learning",
    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "models": {
        "classical_ml": {
            "algorithm": "Logistic Regression",
            "accuracy": classical_accuracy
        },
        "quantum_ml": {
            "algorithm": "Hybrid Variational Quantum Classifier",
            "accuracy": quantum_accuracy
        }
    },
    "conclusion": ""
}

# =================================================
# CONCLUSION LOGIC
# =================================================
if classical_accuracy > quantum_accuracy:
    results["conclusion"] = (
        "Classical ML outperforms Quantum ML due to current "
        "hardware and qubit limitations."
    )
else:
    results["conclusion"] = (
        "Quantum ML shows competitive performance and future potential."
    )

# =================================================
# SAVE RESULTS TO FILE
# =================================================
OUTPUT_FILE = "comparison_results.json"

with open(OUTPUT_FILE, "w") as f:
    json.dump(results, f, indent=4)

# =================================================
# PRINT RESULTS
# =================================================
print("\nMODEL COMPARISON RESULTS")
print("------------------------")
print(f"Classical ML Accuracy : {classical_accuracy}")
print(f"Quantum ML Accuracy   : {quantum_accuracy}")

print("\nConclusion:")
print(results["conclusion"])

print(f"\nResults saved to: {OUTPUT_FILE}")
