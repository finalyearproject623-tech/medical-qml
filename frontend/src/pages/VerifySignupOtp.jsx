import { useState } from "react";
import { verifySignupOtp } from "../api/auth";

const VerifySignupOtp = ({ email, switchToLogin }) => {

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await verifySignupOtp({
        email,
        otp
      });

      switchToLogin();

    } catch {

      setError("Invalid OTP");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600">

      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96">

        <h2 className="text-3xl text-white font-bold text-center mb-6">
          Verify Email OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Enter OTP"
            autoComplete="one-time-code"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 rounded-xl"
          />

          {error && (
            <p className="text-red-200 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-indigo-600 py-3 rounded-xl"
          >
            Verify OTP
          </button>

        </form>

      </div>

    </div>

  );
};

export default VerifySignupOtp;