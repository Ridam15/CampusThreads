const Comment = require("../models/Comment");

exports.likeComment = async (req, res) => {
  try {
    const commentId = req.body.commentId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this comment",
      });
    }

    comment.likes.push(req.user.id);

    await comment.save();

    res.status(200).json({
      success: true,
      message: "comment liked successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.unlikeComment = async (req, res) => {
  try {
    const commentId = req.body.commentId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "comment not found",
      });
    }

    if (!comment.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this comment",
      });
    }

    comment.likes.pull(req.user.id);
    await comment.save();

    res.status(200).json({
      success: true,
      message: "comment unliked successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};