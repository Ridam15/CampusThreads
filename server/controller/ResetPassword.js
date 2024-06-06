const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const resetPassword = require("../utils/mailTemplates/resetPassword");

exports.resetPasswordToken = async (req, res) => {
    try {
      const email = req.body.email;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not exists",
        });
      }
  
      const token = crypto.randomUUID();
      user.token = token;
      const updatedDetails = await User.findOneAndUpdate(
        { email },
        {
          token: token,
          resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
        { new: true }
      );
      const url = `http://localhost:5173/reset-password/${token}`;
      await mailSender(
        email,
        "Password Reset Link",
        resetPassword(url, user.firstName)
      );
  
      res.status(200).json({
        success: true,
        message: "Email sent successfully, please check your email    ",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  exports.resetPassword = async (req, res) => {
    try {
      const { newPassword, token, newConfirmPassword } = req.body;
  
      if (!newPassword || !token || !newConfirmPassword) {
        return res.status(403).json({
          success: false,
          message: "Required fields are missing",
        });
      }
  
      if (newPassword !== newConfirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Password and Confirm Password Value do not match,Please try again",
        });
      }
      const user = await User.findOne({ token });
      if (!user) {
        return res.json({
          success: false,
          message: "Invalid Token",
        });
      }
  
      if (user.reserPasswordExpires < Date.now()) {
        return res.json({
          success: false,
          message: "Token Expired",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.findOneAndUpdate(
        { token },
        {
          token: undefined,
          reserPasswordExpires: undefined,
          password: hashedPassword,
        },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something Went Wrong",
      });
    }
  };
  