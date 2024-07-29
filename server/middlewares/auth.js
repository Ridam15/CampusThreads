const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
    try {
      let token = req.body.token || req.cookies.token;
  
      if (req.header("Authorization")) {
        token = req.header("Authorization").replace("Bearer ", "");
      }
  
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token is missing",
        });
      }
      try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "token is invalid",
        });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
  
  exports.isStudent = async (req, res, next) => {
    try {
      if (req.user.accountType !== "Student") {
        return res.status(401).json({
          success: false,
          message: "This is Protected Route for Stuent only",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User role cannot be verified, please try again",
      });
    }
  };

  exports.isProfessor = async (req, res, next) => {
    try {
      if (req.user.accountType !== "Instructor") {
        return res.status(401).json({
          success: false,
          message: "This is Protected Route for Instructor only",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User role cannot be verified, please try again",
      });
    }
  };