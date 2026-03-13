import { useState } from "react";
import { loginUser } from "../api/auth";

const Login = ({ setIsLoggedIn, switchToSignup, switchToForgot }) => {

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      <div className="w-1/2 flex flex-col justify-center items-center text-white p-16">
        <h1 className="text-5xl font-bold mb-6">Medical Hybrid QML</h1>
      </div>

      <div className="w-1/2 flex items-center justify-center">

        <div className="bg-white/20 p-10 rounded-3xl w-96 backdrop-blur-lg">

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})}
              className="w-full p-3 rounded-xl bg-white/30 text-white"
            />

            <input
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(e)=>setForm({...form,password:e.target.value})}
              className="w-full p-3 rounded-xl bg-white/30 text-white"
            />

            {error && <p className="text-red-200 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-white text-purple-600 py-3 rounded-xl"
            >
              Login
            </button>

          </form>

          <p onClick={switchToForgot} className="text-white text-center mt-4 cursor-pointer">
            Forgot Password?
          </p>

          <p className="text-center text-white mt-2">
            Don’t have account?
            <span onClick={switchToSignup} className="ml-2 cursor-pointer underline">
              Signup
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;