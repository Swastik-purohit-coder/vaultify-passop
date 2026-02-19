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
  ShieldCheck,
  Loader2,
  LogOut,
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState("");

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
  const deletePassword = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePassword = async () => {
    if (!deleteTargetId) return;
    try {
      setLoading(true);
      await axios.delete(`/delete/${deleteTargetId}`);
      await fetchPasswords();
      setShowDeleteConfirm(false);
      setDeleteTargetId("");
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
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-emerald-500">&lt;</span>
            pass
            <span className="text-emerald-500">OP/&gt;</span>
          </h1>

          <div className="flex gap-3 items-center">
            <button
              onClick={toggleTheme}
              className={`h-10 w-10 rounded-full border flex items-center justify-center transition-colors ${
                isDark
                  ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                  : "border-slate-300 bg-white hover:bg-slate-100"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </nav>

        {/* FORM */}
        <div className={`p-6 rounded-2xl border shadow-sm ${cardTheme}`}>
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="site"
              placeholder="Website URL"
              value={form.site}
              onChange={handleChange}
              className={`p-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 ${inputTheme}`}
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className={`p-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 ${inputTheme}`}
            />

            <div className="relative md:col-span-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full p-3 pr-12 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 ${inputTheme}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

          </div>

          <button
            onClick={savePassword}
            disabled={loading}
            className="mt-5 bg-emerald-500 px-6 py-2.5 rounded-xl text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-70"
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
              <div key={item._id} className={`p-5 rounded-2xl border shadow-sm ${cardTheme}`}>
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
                    {visiblePasswords[item._id] ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>

                  <button onClick={() => copyToClipboard(item.password, item._id)}>
                    {copiedId === item._id ? (
                      <span className="text-xs text-emerald-400">Copied</span>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>

                  <button onClick={() => deletePassword(item._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="fixed bottom-6 right-6 z-40 bg-red-500 text-white px-4 py-2.5 rounded-xl shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-center justify-center px-4">
            <div className={`w-full max-w-sm rounded-2xl border p-6 shadow-xl ${cardTheme}`}>
              <h3 className="text-lg font-semibold">Confirm logout</h3>
              <p className="mt-2 text-sm opacity-80">Are you sure want to log out?</p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`px-4 py-2 rounded-lg border ${
                    isDark
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  No
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-center justify-center px-4">
            <div className={`w-full max-w-sm rounded-2xl border p-6 shadow-xl ${cardTheme}`}>
              <h3 className="text-lg font-semibold">Confirm delete</h3>
              <p className="mt-2 text-sm opacity-80">Are you sure want to delete this password?</p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTargetId("");
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    isDark
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  No
                </button>
                <button
                  onClick={confirmDeletePassword}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Manager;
