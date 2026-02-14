import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "lucide-react";
  const API = "https://vaultify-passop.onrender.com";

const Manager = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState("");

  const [form, setform] = useState({
    site: "",
    username: "",
    password: ""
  });

  const [passwordArray, setpasswordArray] = useState([]);

  /* ===============================
     FETCH PASSWORDS FROM DATABASE
  =============================== */

  useEffect(() => {
    fetchPasswords();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const fetchPasswords = async () => {
    try {
      const res = await axios.get(`${API}/passwords`);
      setpasswordArray(res.data);
    } catch (error) {
      console.log("Error fetching passwords", error);
    }
  };

  /* ===============================
     TOGGLE PASSWORD VISIBILITY
  =============================== */

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleSavedPasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 1200);
    } catch (error) {
      console.log("Error copying text", error);
    }
  };

  /* ===============================
     SAVE PASSWORD TO DATABASE
  =============================== */

  const savePassword = async () => {

    if (form.site === "" || form.username === "" || form.password === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${API}/add`, form);

      fetchPasswords(); // refresh list

      setform({
        site: "",
        username: "",
        password: ""
      });

    } catch (error) {
      console.log("Error saving password", error);
    }
  };

  /* ===============================
     DELETE PASSWORD
  =============================== */

  const deletePassword = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this password?");
    if (!shouldDelete) return;

    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchPasswords();
    } catch (error) {
      console.log("Error deleting password", error);
    }
  };

  /* ===============================
     HANDLE INPUT CHANGE
  =============================== */

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const pageTheme = isDark
    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
    : "bg-gradient-to-br from-slate-100 via-emerald-50 to-cyan-50 text-slate-900";

  const panelTheme = isDark
    ? "border-slate-700 bg-slate-900/70"
    : "border-white/40 bg-white/70";

  const inputTheme = isDark
    ? "border-slate-700 bg-slate-800/80 text-slate-100 placeholder:text-slate-400"
    : "border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400";

  const subtleTextTheme = isDark ? "text-slate-400" : "text-slate-600";

  const cardTheme = isDark
    ? "border-slate-700/60 bg-slate-900/75"
    : "border-white/40 bg-white/75";

  return (
    <div>
      <div className={`min-h-screen w-full transition-colors duration-300 ${pageTheme}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav className={`mb-8 flex items-center justify-between rounded-2xl border backdrop-blur-xl shadow-lg px-5 py-4 transition-all duration-300 ${isDark ? "border-slate-700 bg-slate-900/60" : "border-white/30 bg-white/60"}`}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="text-emerald-500">&lt;</span>
              pass
              <span className="text-emerald-500">OP/&gt;</span>
            </h1>
            <p className={`text-sm ${subtleTextTheme}`}>Your Own Password Manager</p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:scale-105 hover:shadow-md transition-all duration-200 ${isDark ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light" : "Dark"}
          </button>
        </nav>

        <section className={`rounded-2xl border backdrop-blur-xl shadow-xl p-4 sm:p-6 lg:p-8 transition-all duration-300 ${panelTheme}`}>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Vault Dashboard</h2>
            <p className={`text-sm sm:text-base ${subtleTextTheme}`}>Store and manage your credentials securely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative md:col-span-2">
              <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.site}
                onChange={handleChange}
                placeholder="Enter website URL"
                className={`w-full rounded-xl border pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 ${inputTheme}`}
                type="text"
                name="site"
              />
            </div>

            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                className={`w-full rounded-xl border pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 ${inputTheme}`}
                type="text"
                name="username"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full rounded-xl border pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 ${inputTheme}`}
                type={showPassword ? "text" : "password"}
                name="password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-emerald-500 transition-colors duration-200 ${isDark ? "text-slate-300" : "text-slate-500"}`}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={savePassword}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-white font-medium shadow-md hover:bg-emerald-600 hover:-translate-y-0.5 transition-all duration-200"
            >
              <ShieldCheck size={18} />
              Add Password
            </button>
          </div>
        </section>

        <section className="mt-8">
          {passwordArray.length === 0 ? (
            <div className={`rounded-2xl border border-dashed p-10 text-center ${isDark ? "border-slate-700 bg-slate-900/50 text-slate-400" : "border-slate-300 bg-white/50 text-slate-600"}`}>
              No passwords saved yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {passwordArray.map((item) => (
                <div
                  key={item._id}
                  className={`rounded-2xl border backdrop-blur-lg p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${cardTheme}`}
                >
                  <div className={`space-y-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    <p className="break-words"><span className="font-semibold">Site:</span> {item.site}</p>
                    <p className="break-words"><span className="font-semibold">Username:</span> {item.username}</p>
                    <p className="break-words"><span className="font-semibold">Password:</span> {visiblePasswords[item._id] ? item.password : "•".repeat(item.password.length)}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSavedPasswordVisibility(item._id)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 ${isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                    >
                      {visiblePasswords[item._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      {visiblePasswords[item._id] ? "Hide" : "Show"}
                    </button>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.password, item._id)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 ${isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                    >
                      <Copy size={16} />
                      {copiedId === item._id ? "Copied" : "Copy"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deletePassword(item._id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition-all duration-200"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        </div>
      </div>
    </div>
  );
};

export default Manager;
