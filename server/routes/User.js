const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendOTP,
} = require("../controller/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controller/ResetPassword");

const { auth } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendOTP);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;