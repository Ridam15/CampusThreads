const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  collegeName: {
    type: String,
    trim: true,
  },
  collegeBranch: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
