const mongoose = require("mongoose");

/* -------------------- Counter Schema (Auto-increment) -------------------- */
const CounterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // counter name (e.g. "bookingId")
  seq: { type: Number, default: 0 },
});

// Prevent OverwriteModelError
const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

/* -------------------- Booking Schema -------------------- */
const BookingSchema = new mongoose.Schema({
  bookingId: { type: Number, unique: true }, // auto-incremented ID
  email: { type: String, required: true },

  services: [
    {
      name: { type: String, required: true }, // ✅ must always have a name
      type: { type: String, default: "Unknown" },
      price: { type: Number, default: 0 },
      quantity: { type: Number, default: 1 },
    },
  ],

  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }, // booking creation timestamp
  eventDate: { type: Date, required: true }, // actual event date

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending",
  },
});

/* -------------------- Pre-save Hook for Auto-increment -------------------- */
BookingSchema.pre("save", async function (next) {
  if (this.isNew && !this.bookingId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: "bookingId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.bookingId = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

/* -------------------- Export Model -------------------- */
const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

module.exports = Booking;
