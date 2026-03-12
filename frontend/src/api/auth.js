import API from "./api";

// -----------------------------
// SIGNUP (Send OTP)
// -----------------------------
export const signupUser = async (data) => {
  const res = await API.post("/signup", data);
  return res.data;
};

// -----------------------------
// VERIFY SIGNUP OTP
// -----------------------------
export const verifySignupOtp = async (data) => {
  const res = await API.post("/verify-signup-otp", data);
  return res.data;
};

// -----------------------------
// LOGIN (OAuth2 Form)
// -----------------------------
export const loginUser = async (data) => {

  const formData = new URLSearchParams();

  formData.append("username", data.email);
  formData.append("password", data.password);

  const res = await API.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const token = res.data.access_token || res.data.token;

  if (!token) {
    throw new Error("Invalid login response");
  }

  localStorage.setItem("token", token);
  localStorage.setItem("role", res.data.role || "user");

  return res.data;
};

// -----------------------------
// FORGOT PASSWORD
// -----------------------------
export const forgotPassword = async (data) => {
  const res = await API.post("/forgot-password", data);
  return res.data;
};

// -----------------------------
// RESET PASSWORD
// -----------------------------
export const resetPassword = async (data) => {
  const res = await API.post("/reset-password", data);
  return res.data;
};