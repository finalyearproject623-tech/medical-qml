import { useState } from "react";
import { signupUser } from "../api/auth";

const Signup = ({ switchToLogin, switchToVerify }) => {

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {

    setError("");
    setMessage("");

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      const res = await signupUser({
        email: form.email,
        password: form.password,
      });

      setMessage(res.message);

      // move to OTP page
      setTimeout(() => {
        switchToVerify(form.email);
      }, 1200);

    } catch (err) {

      setError(err.response?.data?.detail || "Signup failed");

    }

  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-500 via-teal-500 to-blue-600">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col justify-center items-center text-white p-16 animate-fadeIn">

        <h1 className="text-5xl font-bold mb-6 tracking-wide">
          Medical Hybrid QML
        </h1>

        <p className="text-lg text-center max-w-md leading-relaxed opacity-90">
          Register to access the intelligent
          <span className="font-semibold"> Heart Disease Prediction System </span>
          powered by
          <span className="font-semibold"> Quantum Machine Learning </span>
          and
          <span className="font-semibold"> Classical Machine Learning</span>.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center">

        <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl p-10 rounded-3xl w-96 animate-slideUp">

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Create Account
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

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-white"
            />

            {error && (
              <p className="text-red-200 text-sm text-center">{error}</p>
            )}

            {message && (
              <p className="text-green-200 text-sm text-center">{message}</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-white text-green-600 font-semibold py-3 rounded-xl hover:scale-105 transition duration-200"
            >
              Signup
            </button>

            <p className="text-center text-white text-sm">
              Already have an account?{" "}
              <span
                onClick={switchToLogin}
                className="font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;