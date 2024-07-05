const Post = require("../models/Post");
const User = require("../models/User");
const Community = require("../models/Community");
const Tag = require("../models/Tag");
// const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Comment = require("../models/Comment");

exports.createPost = async (req, res) => {
  try {
    let { content, communityName, tags, pictureUrl } = req.body;
    const userId = req.user.id;
    if (!userId || !content || !communityName) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const communityDetails = await Community.findOne({ name: communityName });

    if (!communityDetails) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    let fileUrl = "";
    if(pictureUrl) fileUrl = pictureUrl;
    tagArray = [];

    // if (req.files && req.files.file) {
    //   const filei = await uploadToCloudinary(req.files.file);
    //   fileUrl = filei.secure_url;
    // }

    let post = await Post.create({
      createdBy: userId,
      content,
      community: communityDetails._id,
      fileUrl,
    });

    if (tags) {
      tags = tags.split(",");
      for (let i = 0; i < tags.length; i++) {
        const tag = await Tag.findOne({ name: tags[i] });
        if (!tag) {
          const newTag = await Tag.create({ name: tags[i] });
          tagArray.push(newTag._id);
          newTag.posts.push(post._id);
          await newTag.save();
        } else {
          tagArray.push(tag._id);
          tag.posts.push(post._id);
          await tag.save();
        }
      }
    }

    post.tags = tagArray;

    communityDetails.posts.push(post._id);
    user.posts.push(post._id);
    await communityDetails.save();
    await user.save();
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { content, tags, postId, pictureUrl } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }

    if(content) post.content = content;
    if(pictureUrl) post.fileUrl = pictureUrl;

    // for (let i = 0; i < post.tags.length; i++) {
    //   const tag = await Tag.findOne({ name: post.tags[i] });
    //   tag.posts.pull(post._id);
    //   await tag.save();
    // }

    // for (let i = 0; i < tags.length; i++) {
    //   const tag = await Tag.findOne({ name: tags[i] });
    //   if (!tag) {
    //     const newTag = await Tag.create({ name: tags[i] });
    //     postObj.tags.push(newTag._id);
    //   } else {
    //     postObj.tags.push(tag._id);
    //   }
    //   tag.posts.push(post._id);
    //   await tag.save();
    // }

    // if (req.files && req.files.file) {
    //   const fr = await uploadToCloudinary(req.files.file);
    //   post.fileUrl = fr.secure_url;
    // }
    post.updatedAt = Date.now();

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await Post.findById(postId);
    console.log(postId, post);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    for (let i = 0; i < post.tags.length; i++) {
      const tag = await Tag.findOne({ _id: post.tags[i] });
      console.log(tag);
      tag.posts.pull(post._id);
      await tag.save();
    }

    for (let i = 0; i < post.likes.length; i++) {
      const user = await User.findById(post.likes[i]);
      user.posts.pull(post._id);
      await user.save();
    }

    for (let i = 0; i < post.comments.length; i++) {
      const comment = await Comment.findByIdAndDelete(post.comments[i]);
    }

    const community = await Community.findById(post.community);
    await community.posts.pull(post._id);
    await community.save();

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================================================================================================
exports.getPostDetails = async (req, res) => {
  try {
    const postId = req.body.postId;

    const post = await Post.findById(postId)
      .populate("createdBy")
      .populate("tags")
      .populate({
        path: "comments",
        populate: {
          path: "commentedBy",
        },
      })
      .populate("likes");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy")
      .populate("tags")
      .populate("likes")
      .populate("community")
      .populate({
        path: "comments",
        populate: {
          path: "commentedBy",
        },
      });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};