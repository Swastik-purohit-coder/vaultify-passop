import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm p-5 sm:p-8 shadow-xl">
        <p className="text-center text-sm font-semibold text-emerald-600 mb-2">passOP</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-slate-800">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full h-11 px-3 border border-slate-300 rounded-lg text-base outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full h-11 px-3 pr-12 border border-slate-300 rounded-lg text-base outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2.5 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
          >
            Login
          </button>

        </form>

        <p className="text-sm text-center mt-5 text-slate-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-emerald-500 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
