const Doubt = require("../models/Doubt");
exports.likeDoubt = async (req, res) => {
  try {
    const doubtId = req.body.doubtId;
    const doubt = await Doubt.findById(doubtId);

    if (!doubt) {
      return res.status(400).json({
        success: false,
        message: "Doubt not found",
      });
    }

    if (doubt.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this doubt",
      });
    }

    doubt.likes.push(req.user.id);

    await doubt.save();

    res.status(200).json({
      success: true,
      message: "Doubt liked successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.unlikeDoubt = async (req, res) => {
  try {
    const doubtId = req.body.doubtId;
    const doubt = await Doubt.findById(doubtId);

    if (!doubt) {
      return res.status(400).json({
        success: false,
        message: "Doubt not found",
      });
    }

    if (!doubt.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this doubt",
      });
    }

    doubt.likes.pull(req.user.id);
    await doubt.save();

    res.status(200).json({
      success: true,
      message: "Doubt unliked successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
