import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# -----------------------------
# LOAD DATASET
# -----------------------------
df = pd.read_csv("data/heart.csv")

# -----------------------------
# SELECT FINAL FEATURES
# -----------------------------
FEATURES = ["age", "chol", "thalch", "oldpeak"]

X = df[FEATURES]
y = df["num"].apply(lambda x: 1 if x > 0 else 0)

# -----------------------------
# HANDLE MISSING VALUES
# -----------------------------
imputer = SimpleImputer(strategy="mean")
X = imputer.fit_transform(X)

# -----------------------------
# FEATURE SCALING
# -----------------------------
scaler = StandardScaler()
X = scaler.fit_transform(X)

# -----------------------------
# SPLIT DATA
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# TRAIN CLASSICAL MODEL
# -----------------------------
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# -----------------------------
# EVALUATE
# -----------------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("✅ Classical Model Accuracy:", accuracy)

# -----------------------------
# SAVE MODEL FILES
# -----------------------------
joblib.dump(model, "models/classical_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")
joblib.dump(imputer, "models/imputer.pkl")

print("✅ Classical model, scaler, and imputer saved successfully")
