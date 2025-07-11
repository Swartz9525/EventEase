const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  refreshToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/refresh", refreshToken);

module.exports = router;
