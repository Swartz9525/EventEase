// routes/payment.js (CommonJS — for use with your server.js)
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking"); // <-- adjust path if needed

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/**
 * POST /api/payment/order
 * Creates a Razorpay order. Expects either:
 *  - { amount } in paisa OR
 *  - { services: [...] } from which server will compute amount (safer)
 */
router.post("/order", async (req, res) => {
  try {
    // Prefer server-side calculation using services if available
    let amount = Number(req.body.amount) || 0;

    if ((!amount || amount <= 0) && Array.isArray(req.body.services)) {
      const services = req.body.services;
      const rupees = services.reduce(
        (acc, s) => acc + (Number(s.price) || 0) * (s.quantity || 1),
        0
      );
      amount = Math.round(rupees * 100); // paisa
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount), // paisa
      currency: req.body.currency || "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({ message: "Order creation failed", error: err.message });
  }
});

/**
 * POST /api/payment/verify
 * Verifies Razorpay signature and saves booking to DB.
 * Expects: razorpay_order_id, razorpay_payment_id, razorpay_signature, email, services, eventDate
 */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      services,
      total,
      eventDate,
    } = req.body;

    // Basic validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay fields" });
    }
    if (!email) return res.status(400).json({ message: "Missing email" });
    if (!eventDate) return res.status(400).json({ message: "Missing eventDate" });
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "Services required" });
    }
    if (services.some((s) => !s.name)) {
      return res.status(400).json({ message: "Each service must include a name" });
    }

    // Verify signature
    const bodyStr = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(bodyStr.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Save booking
    const booking = new Booking({
      email,
      services,
      total: Number(total) || services.reduce((acc, s) => acc + (Number(s.price) || 0) * (s.quantity || 1), 0),
      eventDate: new Date(eventDate),
      paymentId: razorpay_payment_id,
      date: new Date(),
    });

    await booking.save();

    return res.json({ success: true, message: "Payment verified & booking saved", booking });
  } catch (err) {
    console.error("Payment verification error:", err);

    // If it's a Mongoose validation error, send details
    if (err.name === "ValidationError") {
      const errors = Object.keys(err.errors).map((k) => ({ field: k, message: err.errors[k].message }));
      return res.status(400).json({ message: "Validation failed", errors });
    }

    return res.status(500).json({ message: "Verification failed", error: err.message });
  }
});

module.exports = router;
