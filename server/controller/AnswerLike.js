const Answer = require("../models/Answer");

exports.likeAnswer = async (req, res) => {
  try {
    const answerId = req.body.answerId;
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Answer not found",
      });
    }

    if (answer.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this answer",
      });
    }

    answer.likes.push(req.user.id);

    await answer.save();

    res.status(200).json({
      success: true,
      message: "answer liked successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.unlikeAnswer = async (req, res) => {
  try {
    const answerId = req.body.answerId;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "answer not found",
      });
    }

    if (!answer.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this answer",
      });
    }

    answer.likes.pull(req.user.id);
    await answer.save();

    res.status(200).json({
      success: true,
      message: "answer unliked successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
