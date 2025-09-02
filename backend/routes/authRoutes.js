// File: routes/authRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  refreshToken,
  changePassword,
  addService,
  getServices,
  updateService,
  deleteService,
  addSubService,
  getSubServices,
  updateSubService,
  deleteSubService,
  createBooking,
  getBookingsByEmail,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  getAdminStats,
  createOrder,
  verifyPayment,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// ================= AUTH ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/refresh", refreshToken);
router.post("/change-password", verifyToken, changePassword);

// ================= SERVICE ROUTES =================
router.post("/services", addService);
router.get("/services", getServices);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// ================= SUB-SERVICE ROUTES =================
router.post("/subservices", addSubService);
router.get("/subservices", getSubServices);
router.put("/subservices/:id", updateSubService);
router.delete("/subservices/:id", deleteSubService);

// ================= BOOKING ROUTES =================
// Create booking (public route)
router.post("/bookings", createBooking);

// Get bookings by email (public route, query param: ?email=xyz)
router.get("/bookings", getBookingsByEmail);

// Get all bookings (admin use)
router.get("/bookings/all", getAllBookings);

// Update booking status (admin use)
router.put("/bookings/:id/status", updateBookingStatus);
router.patch("/bookings/:id", updateBookingStatus);

// ================= USER ROUTES =================
router.get("/users", getAllUsers);

//================== Admin =======================
router.get("/admin/stats", getAdminStats);

// //=================create payment order==================
// router.post("/payment/order", createOrder);

// //=================verify payment==================
// router.post("/payment/verify", verifyPayment);

module.exports = router;
