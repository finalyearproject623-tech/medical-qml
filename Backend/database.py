# from pymongo import MongoClient

# MONGO_URL = "mongodb://localhost:27017"

# client = MongoClient(MONGO_URL)
# db = client["medical_qml_db"]

# users_collection = db["users"]
# predictions_collection = db["predictions"]
# otp_collection = db["otp"]   # 🔥 NEW



from pymongo import MongoClient
import os

# =====================================
# MONGO CONNECTION
# =====================================

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb+srv://medicalqml:medicalqml@cluster0.xo5hvif.mongodb.net/medical_qml_db"
)

client = MongoClient(MONGO_URL)

# Force correct DB
db = client["medical_qml_db"]

# Collections
users_collection = db["users"]
predictions_collection = db["predictions"]
otp_collection = db["otp"]

# Debug (REMOVE later if needed)
print("✅ Connected to DB:", client.list_database_names())