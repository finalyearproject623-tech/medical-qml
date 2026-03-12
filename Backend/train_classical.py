# ============================================
# CLASSICAL MODEL TRAINING (9 FEATURES FIXED)
# ============================================

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# --------------------------------
# LOAD DATA
# --------------------------------
df = pd.read_csv("data/heart.csv")

CLASSICAL_FEATURES = [
    "sex", "cp", "trestbps", "fbs",
    "restecg", "exang", "slope",
    "ca", "thal"
]

X = df[CLASSICAL_FEATURES]
y = df["num"].apply(lambda x: 1 if x > 0 else 0)

# --------------------------------
# HANDLE MISSING
# --------------------------------
imputer = SimpleImputer(strategy="most_frequent")
X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# --------------------------------
# ENCODE CATEGORICAL VARIABLES
# --------------------------------
X = pd.get_dummies(X, drop_first=True)

# Save feature names (IMPORTANT)
joblib.dump(X.columns.tolist(), "models/classical_feature_names.pkl")

# --------------------------------
# SCALE
# --------------------------------
scaler = StandardScaler()
X = scaler.fit_transform(X)

# --------------------------------
# SPLIT
# --------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# --------------------------------
# TRAIN
# --------------------------------
model = LogisticRegression(max_iter=2000)
model.fit(X_train, y_train)

print("🧠 Classical Accuracy:", accuracy_score(y_test, model.predict(X_test)))

# --------------------------------
# SAVE EVERYTHING
# --------------------------------
joblib.dump(model, "models/classical_model.pkl")
joblib.dump(imputer, "models/classical_imputer.pkl")
joblib.dump(scaler, "models/classical_scaler.pkl")

print("✅ Classical Model Saved Successfully")