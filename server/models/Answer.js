const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answeredAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  doubt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  content: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isCorrectAnswer: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Answer", answerSchema);
