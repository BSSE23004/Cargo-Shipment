const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  receiver: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["In Transit", "Delivered"],
    default: "In Transit",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shipment", shipmentSchema);
