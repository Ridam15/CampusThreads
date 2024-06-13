const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {
  deleteAccount,
  updateProfile,
  getUserDetails,
  updateProfilePicture,
  getUserPost,
  getUserMemberCommunity,
  getUserEntireDetails,
  updateProfileCoverPage,
  getotheruserdetails,
  getUserDoubts,
  getUserComments,
  getUserAnswer,
} = require("../controllers/Profile");

router.delete("/deleteProfile", auth, deleteAccount);

router.put("/updateProfile", auth, updateProfile);
router.put("/updateProfilePicture", auth, updateProfilePicture);
router.put("/updateProfileCoverPage", auth, updateProfileCoverPage);

router.get("/getUserDetails", auth, getUserDetails);

module.exports = router;