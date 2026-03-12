import { useState } from "react";
import { loginUser } from "../api/auth";

const Login = ({ setIsLoggedIn, switchToSignup, switchToForgot }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      await loginUser(form);
      setIsLoggedIn(true);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col justify-center items-center text-white p-16 animate-fadeIn">

        <h1 className="text-5xl font-bold mb-6 tracking-wide">
          Medical Hybrid QML
        </h1>

        <p className="text-lg text-center max-w-md leading-relaxed opacity-90">
          Intelligent Heart Disease Prediction System combining
          <span className="font-semibold"> Quantum Machine Learning </span>
          and
          <span className="font-semibold"> Classical Machine Learning </span>
          for accurate medical diagnosis.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center">

        <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl p-10 rounded-3xl w-96 animate-slideUp">

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Login
          </h2>

          <div className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-white"
            />

            {error && (
              <p className="text-red-200 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-white text-purple-600 font-semibold py-3 rounded-xl hover:scale-105 transition duration-200"
            >
              Login
            </button>

            <p
              onClick={switchToForgot}
              className="text-white text-sm text-center cursor-pointer hover:underline"
            >
              Forgot Password?
            </p>

            <p className="text-center text-white text-sm">
              Don’t have an account?{" "}
              <span
                onClick={switchToSignup}
                className="font-semibold cursor-pointer hover:underline"
              >
                Signup
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;