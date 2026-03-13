import { useState } from "react";
import { forgotPassword } from "../api/auth";

const ForgotPassword = ({ switchToReset }) => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();   // prevent page refresh

    try {

      setError("");
      setMessage("");

      const res = await forgotPassword({ email });

      setMessage(res.message);

      setTimeout(() => {
        switchToReset(email);
      }, 1000);

    } catch {

      setError("Email not found");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">

      <div className="backdrop-blur-lg bg-white/20 p-10 rounded-3xl shadow-2xl w-96 border border-white/30">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Forgot Password
        </h2>

        {/* FORM START */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white border border-white/40 focus:outline-none"
          />

          {error && (
            <p className="text-red-200 text-sm text-center">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-200 text-sm text-center">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-2 bg-white text-purple-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Send OTP
          </button>

        </form>
        {/* FORM END */}

      </div>

    </div>

  );
};

export default ForgotPassword;