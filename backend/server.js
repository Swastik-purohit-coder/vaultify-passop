require("dotenv").config({ path: "./.env" });
console.log("ENV VALUE:", process.env.MONGO_URI);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

/* ======================
   DATABASE CONNECTION
====================== */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

/* ======================
   SCHEMA
====================== */

const passwordSchema = new mongoose.Schema({
  site: String,
  username: String,
  password: String
});

const Password = mongoose.model("Password", passwordSchema);


/* ======================
   ROUTES
====================== */

// Add password
app.post("/add", async (req, res) => {
  try {
    const newPassword = new Password(req.body);
    await newPassword.save();
    res.json({ message: "Password Saved" });
  } catch (error) {
    res.status(500).json({ error: "Error Saving Password" });
  }
});

// Get all passwords
app.get("/passwords", async (req, res) => {
  try {
    const data = await Password.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Passwords" });
  }
});

// Delete password
app.delete("/delete/:id", async (req, res) => {
  try {
    await Password.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error Deleting Password" });
  }
});


/* ======================
   SERVER START
====================== */

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});
