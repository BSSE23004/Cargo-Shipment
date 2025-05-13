// app.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const shipmentRoutes = require("./routes/shipmentRoutes");
dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("API is running"));

// API routes
app.use("/api/shipments", shipmentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server Error" });
});

module.exports = app;
