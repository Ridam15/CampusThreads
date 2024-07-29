const Community = require("../models/Community");
const Tag = require("../models/Tag");
const User = require("../models/User");
const Post = require("../models/Post");
const Doubt = require("../models/Doubt");
// const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.createCommunity = async (req, res) => {
  try {
    let { name, tags, description, pictureUrl, coverPictureUrl } = req.body;
    let createdBy = req.user.id;

    if (!name || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
    const communityExists = await Community.findOne({ name });
    if (communityExists) {
      return res.status(400).json({
        success: false,
        message: "Community already exists",
      });
    }

    createdBy = await User.findById(createdBy);
    if (!createdBy) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let tagsId = [];

    if (tags) {
      tags = tags.split(",");
      for (let i = 0; i < tags.length; i++) {
        const tag = await Tag.findOne({ name: tags[i] });
        if (!tag) {
          const newTag = await Tag.create({ name: tags[i] });
          tagsId.push(newTag._id);
        } else {
          tagsId.push(tag._id);
        }
      }
    }

    const tagsinDB = await Tag.find({ _id: { $in: tagsId } });

    let community = await Community.create({
      name,
      createdBy,
      tags: tagsinDB,
      description,
      picture: pictureUrl,
      coverPage: coverPictureUrl,
    });

    if (tags) {
      for (let i = 0; i < tags.length; i++) {
        const tag = await Tag.findOne({ name: tags[i] });
        tag.communities.push(community._id);
        await tag.save();
      }
    }

    // if (req.files && req.files.picture) {
    //   const pictureUrl = await uploadToCloudinary(req.files.picture);
    //   community.picture = pictureUrl.secure_url;
    // }

    // if (req.files && req.files.coverPage) {
    //   const coverPageUrl = await uploadToCloudinary(req.files.coverPage);
    //   community.coverPage = coverPageUrl.secure_url;
    // }

    community.members.push(createdBy);
    await community.save();

    createdBy.community.push(community._id);
    await createdBy.save();

    res.status(200).json({
      success: true,
      message: "Community created successfully",
      data: community,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    const { name, description, pictureUrl, coverPictureUrl } = req.body; // picture, coverPage
    const user = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Community name is required",
      });
    }
    let communityExists = await Community.findOne({ name });

    if (!communityExists) {
      return res.status(400).json({
        success: false,
        message: "Community not found",
      });
    }

    if (
      communityExists.createdBy.toString() !== user &&
      !communityExists.moderators.includes(user)
    ) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to update this community",
      });
    }
    // let tagId = [];

    // tags.forEach(async (tagName) => {
    //   const tag = await Tag.findOne({ name: tagName });
    //   if (!tag) {
    //     const newTag = await Tag.create({ name: tagName });
    //     newTag.communities.push(communityExists);
    //     await newTag.save();
    //     tagId.push(newTag._id);
    //   } else {
    //     tag.communities.push(communityExists);
    //     await tag.save();
    //     tagId.push(tag._id);
    //   }
    // });

    if (description) communityExists.description = description;
    if (pictureUrl) communityExists.picture = pictureUrl;
    if (coverPictureUrl) communityExists.coverPage = coverPictureUrl;

    /*
    if (picture) communityExists.picture = picture; i think this should work clearly
    if (coverPage) communityExists.coverPage = coverPage; 
    */

    // if (tags.length > 0 && communityExists.tags) {
    //   communityExists.tags.forEach(async (tagName) => {
    //     let tag = await Tag.findById(tagName);
    //     if (tag) {
    //       tag.communities.pull(communityExists);
    //       await tag.save();
    //       communityExists.tags.pull(tag);
    //     }
    //   });
    // }
    // console.log(tagId);

    // communityExists.tags = tagId;
    await communityExists.save();
    res.status(200).json({
      success: true,
      message: "Community updated successfully",
      data: communityExists,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.user.id;

    if (!name) {
      return res.status(200).json({
        success: false,
        message: "Community name is required",
      });
    }

    const community = await Community.findOne({ name });
    if (!community) {
      return res.status(200).json({
        success: false,
        message: "Community not found",
      });
    }

    if (community.createdBy.toString() !== user) {
      return res.status(200).json({
        success: false,
        message: "You are not authorized to delete this community",
      });
    }

    community.tags.forEach(async (tagId) => {
      const tag = await Tag.findById(tagId);
      tag.communities.pull(community._id);
      await tag.save();
    });

    community.members.forEach(async (member) => {
      const user = await User.findById(member);
      user.community.pull(community);
      await user.save();
    });

    community.posts.forEach(async (post) => {
      let postdetails = await Post.findById(post);
      postdetails.community = null;
      await postdetails.save();
    });

    await Community.findByIdAndDelete(community._id);

    res.status(200).json({
      success: true,
      message: "Community deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCommunityDetails = async (req, res) => {
  try {
    const name = req.body.name;

    if (!name) {
      return res.status(404).json({
        success: false,
        message: "Community name is missing",
      });
    }

    const community = await Community.findOne({ name })
      .populate("tags")
      .populate("createdBy")
      .populate("tags")
      .populate("moderators")
      .populate("members")
      .exec();

    if (!community) {
      return res.status(200).json({
        success: false,
        message: "Community not found",
      });
    }

    res.status(200).json({
      success: true,
      data: community,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { communityName, useremail } = req.body;

    if (!communityName || !useremail) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(400).json({
        success: false,
        message: "Community not found",
      });
    }

    const user = await User.findOne({ email: useremail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (community.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of the community",
      });
    }

    community.members.push(user._id);
    await community.save();
    user.community.push(community._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "User added to community successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { communityName, useremail } = req.body;

    if (!communityName || !useremail) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(400).json({
        success: false,
        message: "Community not found",
      });
    }

    const user = await User.findOne({ email: useremail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!community.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of the community",
      });
    }

    community.members.pull(user._id);
    await community.save();

    user.community.pull(community._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "User removed from community successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addModerator = async (req, res) => {
  try {
    const { communityName, useremail } = req.body;
    const requestedUser = req.user.id;

    if (!communityName || !useremail) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(400).json({
        success: false,
        message: "Community not found",
      });
    }

    const user = await User.findOne({ email: useremail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (community.moderators.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already a moderator of the community",
      });
    }

    if (!community.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of the community",
      });
    }

    if (community.createdBy.toString() !== requestedUser) {
      return res.status(200).json({
        success: false,
        message: "You are not authorized to Add Moderator",
      });
    }

    community.moderators.push(user._id);
    await community.save();

    res.status(200).json({
      success: true,
      message: "User added as moderator successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeModerator = async (req, res) => {
  try {
    const { communityName, useremail } = req.body;
    const requestedUser = req.user.id;

    if (!communityName || !useremail) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(400).json({
        success: false,
        message: "Community not found",
      });
    }

    const user = await User.findOne({ email: useremail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!community.moderators.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is not a moderator of the community",
      });
    }

    if (!community.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of the community",
      });
    }

    if (community.createdBy.toString() !== requestedUser) {
      return res.status(200).json({
        success: false,
        message: "You are not authorized to Remove Moderator",
      });
    }

    community.moderators.pull(user._id);
    await community.save();

    res.status(200).json({
      success: true,
      message: "User removed as moderator successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.updateCommunityPicture = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const user = req.user.id;
//     const picture = req.files.picture; // multer to use karu ne ?

//     if (!name || !picture) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields are missing",
//       });
//     }

//     let communityExists = await Community.findOne({ name });

//     if (!communityExists) {
//       return res.status(400).json({
//         success: false,
//         message: "Community not found",
//       });
//     }

//     if (
//       communityExists.createdBy.toString() !== user &&
//       !communityExists.moderators.includes(user)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "You are not authorized to update this community",
//       });
//     }

//     const image = await uploadToCloudinary(
//       picture,
//       communityExists.name// Assuming to have a separate folder for community images
//     );

//     communityExists.picture = image.secure_url;
//     await communityExists.save();

//     res.status(200).json({
//       success: true,
//       message: "Community picture updated successfully",
//       data: communityExists,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.updateCommunityCoverPage = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const user = req.user.id;
//     const coverPage = req.files.coverPage; // ama bi multer use karu chu

//     if (!name || !coverPage) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields are missing",
//       });
//     }

//     let communityExists = await Community.findOne({ name });

//     if (!communityExists) {
//       return res.status(400).json({
//         success: false,
//         message: "Community not found",
//       });
//     }

//     if (
//       communityExists.createdBy.toString() !== user &&
//       !communityExists.moderators.includes(user)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "You are not authorized to update this community",
//       });
//     }

//     const image = await uploadToCloudinary(
//       coverPage,
//       communityExists.name // Assuming you have a separate folder for community images
//     );

//     communityExists.coverPage = image.secure_url;
//     await communityExists.save();

//     res.status(200).json({
//       success: true,
//       message: "Community cover page updated successfully",
//       data: communityExists,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find({})
      .populate("createdBy")
      .populate("members")
      .populate("moderators")
      .exec();

    res.status(200).json({
      success: true,
      message: "Communities fetched successfully",
      data: communities,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCommunityPosts = async (req, res) => {
  try {
    const name = req.body.name;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Community name is required",
      });
    }

    const community = await Community.findOne({ name });

    if (!community) {
      return res.status(400).json({
        success: false,
        message: "Community not found",
      });
    }

    const posts = await Post.find({ community: community._id })
      .populate("createdBy")
      .populate("comments")
      .populate("tags");

    res.status(200).json({
      success: true,
      message: "Community posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCommunityDoubts = async (req, res) => {
  try {
    const name = req.body.name;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Community name is required",
      });
    }

    const community = await Community.findOne({ name });

    if (!community) {
      return res.status(400).json({
        success: false,
        message: "Community not found",
      });
    }

    const doubts = await Doubt.find({ community: community._id })
      .populate("createdBy")
      .populate("tags")
      .populate("answers");

    res.status(200).json({
      success: true,
      message: "Community doubts fetched successfully",
      data: doubts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
