import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# LOAD DATA
df = pd.read_csv("data/heart.csv")

# USE ALL FEATURES
X = df.drop("num", axis=1)
y = df["num"].apply(lambda x: 1 if x > 0 else 0)

# HANDLE MISSING
imputer = SimpleImputer(strategy="mean")
X = imputer.fit_transform(X)

# SCALE
scaler = StandardScaler()
X = scaler.fit_transform(X)

# SPLIT
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# TRAIN RANDOM FOREST
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

# ACCURACY
pred = model.predict(X_test)
print("Classical Accuracy:", accuracy_score(y_test, pred))

# SAVE
joblib.dump(model, "models/classical_model.pkl")
joblib.dump(imputer, "models/classical_imputer.pkl")
joblib.dump(scaler, "models/classical_scaler.pkl")

print("Classical model saved")