const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Service = require("../models/Service");
const SubService = require("../models/SubServices");
const Booking = require("../models/Booking");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";
const CLIENT_URL = process.env.BASE_URL || "http://localhost:5173"; // frontend

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      mobile,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = {
      id: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      mobile: user.mobile,
      role: user.role || "user",
      profilePic: user.profilePic || "",
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: accessToken,
      refreshToken,
      user: payload, // ✅ send user info to frontend
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// FORGOT PASSWORD with email sending
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"EventEase Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset Your Password",
      html: `
        <p>Hello <b>${user.firstName}</b>,</p>
        <p>You requested to reset your password.</p>
        <p><a href="${resetUrl}" style="color:#007bff;">Click here to reset password</a></p>
        <p>This link will expire in 15 minutes.</p>
        <br/>
        <p>Regards,<br/>EventEase Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to your email!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send reset link", error: err.message });
  }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ token: newToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// ADD SERVICE
const addService = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newService = new Service({ name, description, image });
    await newService.save();

    res.status(201).json({ message: "Service added successfully", service: newService });
  } catch (error) {
    console.error("addService error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET ALL SERVICES
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE SERVICE
const updateService = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, image },
      { new: true } // ✅ return updated doc instead of old one
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(updatedService); // ✅ send updated object back
  } catch (error) {
    console.error("updateService error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE SERVICE
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Remove image file
    if (service.image) {
      const imagePath = path.join(__dirname, "..", service.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ADD SUBSERVICE
const addSubService = async (req, res) => {
  try {
    const { title, description, price, quantity } = req.body;

    if (!title || !description || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSubService = new SubService({ title, description, price, quantity });
    await newSubService.save();

    res.status(201).json({
      message: "SubService added successfully",
      subService: newSubService,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL SUBSERVICES
const getSubServices = async (req, res) => {
  try {
    const subServices = await SubService.find().sort({ createdAt: -1 });
    res.json(subServices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE SUBSERVICE
const updateSubService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity } = req.body;

    const subService = await SubService.findById(id);
    if (!subService) return res.status(404).json({ message: "SubService not found" });

    subService.title = title || subService.title;
    subService.description = description || subService.description;
    subService.price = price || subService.price;
    subService.quantity = quantity || subService.quantity;

    await subService.save();
    res.json({ message: "SubService updated successfully", subService });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE SUBSERVICE
const deleteSubService = async (req, res) => {
  try {
    const { id } = req.params;

    const subService = await SubService.findById(id);
    if (!subService) return res.status(404).json({ message: "SubService not found" });

    await subService.deleteOne();
    res.json({ message: "SubService deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Create booking
const createBooking = async (req, res) => {
  try {
    const { email, services, total, eventDate } = req.body;

    if (!email || !services || total === undefined || !eventDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Sanitize services array
    const sanitizedServices = services.map((s) => ({
      name: s.name || s.title || "Unknown",
      type: s.type || "Unknown",
      price: Number(s.price) || 0,
      quantity: Number(s.quantity) || 1,
    }));

    const booking = new Booking({
      email,
      services: sanitizedServices,
      total: Number(total) || 0,
      date: new Date(),              // booking creation timestamp
      eventDate: new Date(eventDate),// actual event date
      status: "pending",             // default status
    });

    await booking.save();
    res.status(201).json({ message: "Booking saved successfully", booking });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Get bookings by email (most recent event first)
const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const bookings = await Booking.find({ email }).sort({ eventDate: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 });
    res.json(bookings); // returns all bookings
  } catch (err) {
    console.error("Get all bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update status of a booking (admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking status updated", booking });
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
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
  updateBookingStatus,
  getAllBookings,
  getAllUsers,
};
