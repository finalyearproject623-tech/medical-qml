import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifySignupOtp from "./pages/VerifySignupOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Predict from "./pages/Predict";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

  const [page, setPage] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const role = localStorage.getItem("role");

  // =========================
  // DASHBOARD
  // =========================
  if (isLoggedIn) {
    return role === "admin" ? (
      <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
    ) : (
      <Predict setIsLoggedIn={setIsLoggedIn} />
    );
  }

  // =========================
  // VERIFY SIGNUP OTP
  // =========================
  if (page === "verifySignupOtp")
    return (
      <VerifySignupOtp
        email={signupEmail}
        switchToLogin={() => setPage("login")}
      />
    );

  // =========================
  // FORGOT PASSWORD
  // =========================
  if (page === "forgot")
    return (
      <ForgotPassword
        switchToReset={(email) => {
          setResetEmail(email);
          setPage("reset");
        }}
      />
    );

  // =========================
  // RESET PASSWORD
  // =========================
  if (page === "reset")
    return (
      <ResetPassword
        email={resetEmail}
        switchToLogin={() => setPage("login")}
      />
    );

  // =========================
  // LOGIN
  // =========================
  if (page === "login")
    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        switchToSignup={() => setPage("signup")}
        switchToForgot={() => setPage("forgot")}
      />
    );

  // =========================
  // SIGNUP
  // =========================
  if (page === "signup")
    return (
      <Signup
        switchToLogin={() => setPage("login")}
        switchToVerify={(email) => {
          setSignupEmail(email);
          setPage("verifySignupOtp");
        }}
      />
    );

  return null;
}

export default App;