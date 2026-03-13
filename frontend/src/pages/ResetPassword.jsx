import { useState } from "react";
import { resetPassword } from "../api/auth";

const ResetPassword = ({ email, switchToLogin }) => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      setMessage("");

      const res = await resetPassword({
        email,
        otp,
        new_password: newPassword,
      });

      setMessage(res.message);

      setTimeout(() => {
        switchToLogin();
      }, 1500);

    } catch {
      setError("Invalid OTP or expired");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">

      <div className="backdrop-blur-lg bg-white/20 p-10 rounded-3xl shadow-2xl w-96 border border-white/30">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Reset Password
        </h2>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white border border-white/40 focus:outline-none mb-4"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white border border-white/40 focus:outline-none"
        />

        {error && (
          <p className="text-red-200 text-sm mt-3 text-center">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-200 text-sm mt-3 text-center">
            {message}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-white text-purple-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
        >
          Reset Password
        </button>

      </div>
    </div>
  );
};

export default ResetPassword;
