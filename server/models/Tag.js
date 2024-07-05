const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  doubts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
    },
  ],
});
module.exports = mongoose.model("Tag", tagSchema);
