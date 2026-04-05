from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from database import users_collection, otp_collection
import random

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

router = APIRouter()

SECRET_KEY = "super_secret_key_change_this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

ADMIN_EMAIL = "mylapallisuresh45@gmail.com"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ------------------------------
# EMAIL CONFIG (kept but not used)
# ------------------------------

conf = ConnectionConfig(
    MAIL_USERNAME="gouthamravisgr@gmail.com",
    MAIL_PASSWORD="gmxkswtcynwuechy",
    MAIL_FROM="gouthamravisgr@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Medical Hybrid QML",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

# ------------------------------
# MODELS
# ------------------------------

class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class VerifySignupOTP(BaseModel):
    email: EmailStr
    otp: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str


# ------------------------------
# PASSWORD UTILS
# ------------------------------

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ------------------------------
# SEND OTP EMAIL (not used now)
# ------------------------------

async def send_otp_email(receiver_email: EmailStr, otp: str):
    pass  # disabled to avoid crash on deployment


# ------------------------------
# SIGNUP (SEND OTP)
# ------------------------------

@router.post("/signup")
async def signup(data: SignupRequest):

    if users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    otp = str(random.randint(100000, 999999))

    otp_collection.update_one(
        {"email": data.email},
        {
            "$set": {
                "otp": otp,
                "password": hash_password(data.password),
                "expires_at": datetime.utcnow() + timedelta(minutes=5)
            }
        },
        upsert=True
    )

    # ❌ Email disabled
    # await send_otp_email(data.email, otp)

    return {
        "message": "OTP generated successfully",
        "otp": otp
    }


# ------------------------------
# VERIFY SIGNUP OTP
# ------------------------------

@router.post("/verify-signup-otp")
def verify_signup_otp(data: VerifySignupOTP):

    record = otp_collection.find_one({"email": data.email})

    if not record:
        raise HTTPException(status_code=400, detail="OTP not requested")

    if record["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP expired")

    role = "admin" if data.email == ADMIN_EMAIL else "user"

    users_collection.insert_one({
        "email": data.email,
        "password": record["password"],
        "role": role,
        "created_at": datetime.utcnow()
    })

    otp_collection.delete_one({"email": data.email})

    return {"message": "Account created successfully"}


# ------------------------------
# LOGIN
# ------------------------------

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    user = users_collection.find_one({"email": form_data.username})

    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({
        "sub": user["email"],
        "role": user.get("role", "user")
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.get("role", "user")
    }


# ------------------------------
# FORGOT PASSWORD (FIXED)
# ------------------------------

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):

    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = str(random.randint(100000, 999999))

    otp_collection.update_one(
        {"email": data.email},
        {
            "$set": {
                "otp": otp,
                "expires_at": datetime.utcnow() + timedelta(minutes=5)
            }
        },
        upsert=True
    )

    # ❌ Email disabled (causing crash)
    # await send_otp_email(data.email, otp)

    # ✅ Return OTP directly
    return {
        "message": "OTP generated successfully",
        "otp": otp
    }


# ------------------------------
# RESET PASSWORD
# ------------------------------

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):

    record = otp_collection.find_one({"email": data.email})

    if not record:
        raise HTTPException(status_code=400, detail="OTP not requested")

    if record["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP expired")

    users_collection.update_one(
        {"email": data.email},
        {"$set": {"password": hash_password(data.new_password)}}
    )

    otp_collection.delete_one({"email": data.email})

    return {"message": "Password reset successful"}


# ------------------------------
# GET CURRENT USER
# ------------------------------

def get_current_user(token: str = Depends(oauth2_scheme)):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_collection.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return {"email": email, "role": role}