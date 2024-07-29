const User = require("../models/User");
const Tag = require("../models/Tag");
const Post = require("../models/Post");

exports.searchpost = async (req, res) => {
  const keyword = req.params.keyword;

  try {
    const tag = await Tag.find({
      name: { $regex: `^${keyword}$`, $options: 'i' }
    }).populate('posts');

    const posts = tag.posts;

    res.status(200).json({
      success: true,
      message: "Searched posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting searched posts",
    });
  }
};

//controller for searching by username
exports.searchuser = async (req, res) => {
  const { username } = req.params;
  const usernameParts = username.split(' ');

  try {
    // Create a regex pattern for each part of the username
    const regexPatterns = usernameParts.map(part => new RegExp('^' + part, 'i'));

    // Find the user by matching each part of the username
    const users = await User.find({
      $or: regexPatterns.flatMap(pattern => [
        { firstName: pattern },
        { lastName: pattern }
      ])
    });

    res.status(200).json({
      success: true,
      message: "Searched users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting searched users",
    });
  }
};