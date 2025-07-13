const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  refreshToken,
  changePassword,
};
