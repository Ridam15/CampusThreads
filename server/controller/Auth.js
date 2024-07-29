const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const { passwordUpdated } = require("../utils/mailTemplates/passwordUpdated");
const Community = require("../models/Community");
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

      const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        collegeName: null,
        collegeBranch: null,
      });
  
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        friends: [],
      profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
      coverPicture:
        "https://images.pexels.com/photos/13095812/pexels-photo-13095812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      });

      const gencom = await Community.findOne({ name: "General" });
      gencom.members.push(user._id);
      await gencom.save();
      user.community.push(gencom._id);
      await user.save();
  
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

  exports.changePassword = async (req, res) => {
    try {
      let { oldPassword, newPassword, confirmNewPassword } = req.body;
      let userid = req.user.id;
  
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(403).json({
          success: false,
          message: "All the fields are required",
        });
      }
  
      const user = await User.findById(userid);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not Exists",
        });
      }
  
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  
      if (isOldPasswordValid) {
        if (newPassword !== confirmNewPassword) {
          return res.status(401).json({
            success: false,
            message: "Password and Confirm Password does not match",
          });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateduser = await User.findOneAndUpdate(
          { _id: userid },
          { password: hashedNewPassword },
          { new: true }
        );
  
        try {
          const emailRspomse = mailSender(
            user.email,
            `Password Updated Succesfully for Campus Threads`,
            passwordUpdated(user.email, updateduser.firstName)
          );
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
          });
        }
  
        return res.status(200).json({
          success: true,
          message: "Password updated Successfully",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Password is incorrect",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };