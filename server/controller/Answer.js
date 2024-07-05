const Answer = require("../models/Answer");
const Doubt = require("../models/Doubt");
const User = require("../models/User");

exports.createAnswer = async (req, res) => {
  try {
    const doubtId = req.body.doubtId;
    const { content } = req.body;
    const userId = req.user.id;

    if (!doubtId || !content) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    const answer = new Answer({
      answeredBy: req.user.id,
      content: content,
      doubt: doubtId,
    });

    doubt.answers.push(answer._id);

    await answer.save();
    await doubt.save();

    res.status(201).json({
      success: true,
      message: "Answer created successfully",
      data: answer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateAnswer = async (req, res) => {
  try {
    const answerId = req.body.answerId;
    const { content } = req.body;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    if (answer.answeredBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this answer",
      });
    }

    answer.content = content;

    await answer.save();

    res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      data: answer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a answer
exports.deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.body;

    // Find the answer
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Check if the user is authorized to delete the answer (e.g., the answer's creator)
    if (answer.answeredBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this answer",
      });
    }

    // Delete the answer
    await Answer.findByIdAndDelete(answerId);

    res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markCorrectAnswer = async (req, res) => {
  try {
    const { answerId } = req.body;
    const answer = await Answer.findById(answerId);
    const doubt = await Doubt.findById(answer.doubt);
    const user = await User.findById(answer.answeredBy);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    if (doubt.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to mark this answer correct",
      });
    }

    if (answer.isCorrectAnswer) {
      return res.status(400).json({
        success: false,
        message: "Answer is already marked as correct",
      });
    }

    answer.isCorrectAnswer = true;
    user.contribution = user.contribution + 1;

    await answer.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Answer marked as correct",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.unmarkCorrectAnswer = async (req, res) => {
  try {
    const { answerId } = req.body;
    const answer = await Answer.findById(answerId);
    const doubt = await Doubt.findById(answer.doubt);
    const user = await User.findById(answer.answeredBy);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    if (doubt.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to unmark this answer correct",
      });
    }

    if (!answer.isCorrectAnswer) {
      return res.status(400).json({
        success: false,
        message: "Answer is not marked as correct",
      });
    }

    answer.isCorrectAnswer = false;
    user.contribution = user.contribution - 1;

    await answer.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Answer unmarked as correct",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
