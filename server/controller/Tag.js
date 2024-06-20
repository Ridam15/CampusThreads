const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    const { tagName } = req.body;
    const tagDetails = await Tag.findOne({ name: tagName });
    if (tagDetails) {
      return res.status(400).json({
        sucess: false,
        message: "Tag already exists",
      });
    }
    const tag = await Tag.create({ name: tagName });
    res.status(200).json({
      success: true,
      message: "Tag Created Succesfully",
    });
  } catch (error) {
    console.log("error occured while createing Tag");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went Wrong",
    });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tag = await Tag.find().populate("posts").populate("communities");
    res.status(200).json({
      success: true,
      message: "Tag fetched successfully",
      data: tag,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went Wrong",
    });
  }
};

exports.getTagDetails = async (req, res) => {
  try {
    const tag = await Tag.find({ name: req.body.tag });
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Tag fetched successfully",
      data: tag,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went Wrong",
    });
  }
};
