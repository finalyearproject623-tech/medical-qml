# from pymongo import MongoClient

# MONGO_URL = "mongodb://localhost:27017"

# client = MongoClient(MONGO_URL)
# db = client["medical_qml_db"]

# users_collection = db["users"]
# predictions_collection = db["predictions"]
# otp_collection = db["otp"]   # 🔥 NEW



from pymongo import MongoClient
import os

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb+srv://medicalqml:medicalqml@cluster0.xo5hvif.mongodb.net/?appName=Cluster0"
)

client = MongoClient(MONGO_URL)

db = client["medical_qml_db"]

users_collection = db["users"]
predictions_collection = db["predictions"]
otp_collection = db["otp"]