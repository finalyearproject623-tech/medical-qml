# from pymongo import MongoClient

# MONGO_URL = "mongodb://localhost:27017"

# client = MongoClient(MONGO_URL)
# db = client["medical_qml_db"]

# users_collection = db["users"]
# predictions_collection = db["predictions"]
# otp_collection = db["otp"]   # 🔥 NEW



from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL")

try:
    client = MongoClient(MONGO_URL)
    db = client["medical_qml_db"]

    users_collection = db["users"]
    predictions_collection = db["predictions"]
    otp_collection = db["otp"]

    print("✅ MongoDB Connected Successfully")

except Exception as e:
    print("❌ MongoDB Error:", e)