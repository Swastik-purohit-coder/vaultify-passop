require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

/* ======================
   CORS CONFIG
====================== */

app.use(cors({
  origin: "*", // later you can restrict to your frontend URL
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* ======================
   DATABASE CONNECTION
====================== */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* ======================
   USER SCHEMA
====================== */

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

/* ======================
   PASSWORD SCHEMA
====================== */

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  site: String,
  username: String,
  password: String
});

const Password = mongoose.model("Password", passwordSchema);

/* ======================
   AUTH MIDDLEWARE
====================== */

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  try {
    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contains { id }
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ======================
   AUTH ROUTES
====================== */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* ======================
   PASSWORD ROUTES (PROTECTED)
====================== */

// Add password
app.post("/add", authMiddleware, async (req, res) => {
  try {
    const { site, username, password } = req.body;

    const newPassword = new Password({
      site,
      username,
      password,
      userId: req.user.id
    });

    await newPassword.save();

    res.json({ message: "Password Saved" });

  } catch (error) {
    res.status(500).json({ error: "Error Saving Password" });
  }
});

// Get passwords (only logged-in user's)
app.get("/passwords", authMiddleware, async (req, res) => {
  try {
    const data = await Password.find({ userId: req.user.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Passwords" });
  }
});

// Delete password
app.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    await Password.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    res.json({ message: "Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ error: "Error Deleting Password" });
  }
});

/* ======================
   SERVER START
====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
