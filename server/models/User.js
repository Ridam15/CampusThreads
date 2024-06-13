const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["student", "Professor"],
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    profilePicture: {
      type: String,
    },
    coverPicture: {
      type: String,
    },
    token: {
      type: String,
    },
    reserPasswordExpires: {
      type: Date,
    },
  });
  
  module.exports = mongoose.model("User", userSchema);