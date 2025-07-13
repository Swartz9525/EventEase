const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  refreshToken,
} = require("../controllers/authController");
const { changePassword } = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/refresh", refreshToken);
router.post("/change-password", verifyToken, changePassword);


module.exports = router;
