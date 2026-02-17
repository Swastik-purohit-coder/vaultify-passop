import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Globe,
  User,
  Lock,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const Manager = () => {
  const navigate = useNavigate();

  /* ===============================
     AUTH CHECK
  =============================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  /* ===============================
     THEME
  =============================== */
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  /* ===============================
     STATES
  =============================== */
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    site: "",
    username: "",
    password: "",
  });

  const [passwordArray, setPasswordArray] = useState([]);

  /* ===============================
     FETCH PASSWORDS
  =============================== */
  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/passwords");
      setPasswordArray(res.data);
    } catch (err) {
      setError("Failed to load passwords");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     SAVE PASSWORD
  =============================== */
  const savePassword = async () => {
    if (!form.site || !form.username || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/add", form);
      setForm({ site: "", username: "", password: "" });
      await fetchPasswords();
    } catch (err) {
      alert("Failed to save password");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DELETE PASSWORD
  =============================== */
  const deletePassword = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this password?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`/delete/${id}`);
      await fetchPasswords();
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     HELPERS
  =============================== */
  const toggleSavedPasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 1000);
    } catch {}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ===============================
     THEMES
  =============================== */
  const pageTheme = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-100 text-slate-900";

  const cardTheme = isDark
    ? "bg-slate-900 border-slate-700"
    : "bg-white border-slate-200";

  const inputTheme = isDark
    ? "bg-slate-800 border-slate-700 text-white"
    : "bg-white border-slate-300 text-black";

  return (
    <div className={`min-h-screen transition-all ${pageTheme}`}>
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* NAVBAR */}
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            <span className="text-emerald-500">&lt;</span>
            pass
            <span className="text-emerald-500">OP/&gt;</span>
          </h1>

          <div className="flex gap-3">
            <button onClick={toggleTheme}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* FORM */}
        <div className={`p-6 rounded-xl border ${cardTheme}`}>
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="site"
              placeholder="Website URL"
              value={form.site}
              onChange={handleChange}
              className={`p-3 rounded-lg border ${inputTheme}`}
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className={`p-3 rounded-lg border ${inputTheme}`}
            />

            <div className="relative md:col-span-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${inputTheme}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

          </div>

          <button
            onClick={savePassword}
            disabled={loading}
            className="mt-5 bg-emerald-500 px-6 py-2 rounded-lg text-white hover:bg-emerald-600 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
            Add Password
          </button>
        </div>

        {/* PASSWORD LIST */}
        <div className="mt-8">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && passwordArray.length === 0 && (
            <p className="text-center text-gray-400 mt-6">
              No passwords saved yet.
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {passwordArray.map((item) => (
              <div key={item._id} className={`p-5 rounded-xl border ${cardTheme}`}>
                <p><strong>Site:</strong> {item.site}</p>
                <p><strong>Username:</strong> {item.username}</p>
                <p>
                  <strong>Password:</strong>{" "}
                  {visiblePasswords[item._id]
                    ? item.password
                    : "•".repeat(item.password.length)}
                </p>

                <div className="flex gap-3 mt-4">
                  <button onClick={() => toggleSavedPasswordVisibility(item._id)}>
                    {visiblePasswords[item._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                  <button onClick={() => copyToClipboard(item.password, item._id)}>
                    <Copy size={16} />
                  </button>

                  <button onClick={() => deletePassword(item._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Manager;
