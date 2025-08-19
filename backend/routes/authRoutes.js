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
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ===== Multer setup for service image uploads =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder for storing images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ===== Auth Routes =====
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/refresh", refreshToken);
router.post("/change-password", verifyToken, changePassword);

// ===== Service Routes =====
router.post("/services", upload.single("image"), addService);
router.get("/services", getServices);
router.put("/services/:id", upload.single("image"), updateService);
router.delete("/services/:id", deleteService);

// ===== SubService Routes =====
router.post("/subservices", addSubService);
router.get("/subservices", getSubServices);
router.put("/subservices/:id", updateSubService);
router.delete("/subservices/:id", deleteSubService);

// Route to create booking (no token required)
router.post("/bookings", createBooking);

// Route to get bookings by email (no token required)
router.get("/bookings", getBookingsByEmail);

router.get("/booking", getAllBookings);
router.put("/booking:id/status", updateBookingStatus);

router.get("/users",getAllUsers);
module.exports = router;
