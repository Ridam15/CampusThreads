const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.sendOTP = async (req, res) => {
    try {
      let { email } = req.body;
      email = email.toLowerCase();
      const userAlreadyExists = await User.findOne({ email });
  
      if (userAlreadyExists) {
        return res
          .status(401)
          .json({ success: false, message: "User already registered" });
      }
  
      let otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
  
      let result = await OTP.findOne({ otp: otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        result = await OTP.findOne({ otp: otp });
      }
  
      const otpBody = await OTP.create({
        email: email,
        otp: otp,
      });
  
      res.status(200).json({
        success: true,
        message: "OTP sent Successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.signup = async (req, res) => {
    try {
      let {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
      } = req.body;
  
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !otp ||
        !accountType
      ) {
        return res.status(403).json({
          success: false,
          message: "All fields are required",
        });
      }
      email = email.toLowerCase();
  
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Password and Confirm Password Value do not match,Please try again",
        });
      }
  
      const userAlreadyExists = await User.findOne({ email });
  
      if (userAlreadyExists) {
        return res.status(400).json({
          success: false,
          message: "User already Exists",
        });
      }
  
      const recentOTP = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
        console.log(recentOTP);
      if (recentOTP.length === 0) {
        return res.status(400).json({
          success: false,
          message: "OTP not Found",
        });
      } else if (otp !== recentOTP[0].otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
      });
  
      await OTP.findByIdAndDelete(recentOTP[0]._id);
  
      return res.status(200).json({
        success: true,
        message: "User is registered Successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "User cannot be registrered. Please try again",
      });
    }
  };

  exports.login = async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();
  
      if (!email || !password) {
        return res.status(403).json({
          success: false,
          message: "Please Fill up All the Required Fields",
        });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        console.log("User not found, sending response");
        return res.status(400).json({
          success: false,
          message: "User is not registred, please signup first",
        });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (isPasswordValid) {
        const payload = {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        user.token = token;
        user.password = undefined;
        const options = {
          httpOnly: true,
        };
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: "Logged in successfully",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Password is incorrect",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Login Failure, please try again",
      });
    }
  };