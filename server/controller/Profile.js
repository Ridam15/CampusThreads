const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/User");
// const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Answer = require("../models/Answer");
const Doubt = require("../models/Doubt");

exports.updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth,
      about,
      gender,
      collegeName,
      collegeBranch,
      firstName,
      lastName,
      profilePhotoUrl,
      coverPhotoUrl
    } = req.body;
    const id = req.user.id;

    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    if (firstName) userDetails.firstName = firstName;
    if (lastName) userDetails.lastName = lastName;
    if (profilePhotoUrl) userDetails.profilePicture = profilePhotoUrl;
    if (coverPhotoUrl) userDetails.coverPicture = coverPhotoUrl;
    await userDetails.save();

    if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
    if (about) profile.about = about;
    if (gender) profile.gender = gender;
    if (collegeName) profile.collegeName = collegeName;
    if (collegeBranch) profile.collegeBranch = collegeBranch;

    await profile.save();

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    console.log(id, user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    });

    for (const communityID of user.community) {
      await User.findByIdAndUpdate(
        communityID,
        { $pull: { members: id } },
        { new: true }
      );
    }

    await User.findByIdAndDelete({ _id: id });

    await Comment.deleteMany({ userId: id });
    // await Like.deleteMany({ userId: id });
    await Post.deleteMany({ userId: id });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .populate("interestedTags")
      .populate("friends")
      .exec();
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserPost = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const posts = await Post.find({ createdBy: id })
      .populate("createdBy")
      .populate("comments")
      .populate("likes")
      .populate("tags")
      .populate("community")
      .exec();

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserDoubts = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).populate("doubts").exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const doubt = await Doubt.find({ createdBy: id })
      .populate("createdBy")
      .populate({
        path: "answers",
        populate: {
          path: "answeredBy",
        },
      })
      .populate("likes")
      .populate("tags")
      .populate("community")
      .exec();

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: doubt,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserMemberCommunity = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).populate("community").exec();
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserEntireDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id)
      .populate("additionalDetails")
      .populate("community")
      .populate("posts")
      .populate("friends")
      .populate("doubts")
      .exec();
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error occured while fetching user details");
    console.log(error);
  }
};

exports.getotheruserdetails = async (req, res) => {
  try {
    const userID = req.body.userID;
    const user = await User.findById(userID)
      .populate("additionalDetails")
      .populate("community")
      .populate("posts")
      .populate("friends")
      .populate("doubts")
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;
    user.token = undefined;
    user.reserPasswordExpires = undefined;

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const userId = req.user.id;

    const comments = Comment.find({ commentedBy: userId });

    if (!userID) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: comments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserAnswer = async (req, res) => {
  try {
    const userID = req.user.id;

    const answers = Answer.find({ answeredBy: userID });

    if (!userID) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: answers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};