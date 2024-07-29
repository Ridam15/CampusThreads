const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  dateOfBirth: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    default: null,
  },
  about: {
    type: String,
    trim: true,
    default: null,
  },
  collegeName: {
    type: String,
    trim: true,
    default: null,
  },
  collegeBranch: {
    type: String,
    trim: true,
    default: null,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
