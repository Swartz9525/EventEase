const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  services: [
    {
      name: { type: String, required: true },
      type: { type: String, default: "Unknown" },
      price: { type: Number, default: 0 },
      quantity: { type: Number, default: 1 },
    },
  ],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }, // booking creation timestamp
  eventDate: { type: Date, required: true }, // the actual event day
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // booking status
});

module.exports = mongoose.model("Booking", BookingSchema);
