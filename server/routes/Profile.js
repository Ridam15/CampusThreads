const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {
  deleteAccount,
  updateProfile,
  getUserDetails,
  getUserPost,
  getUserMemberCommunity,
  getUserEntireDetails,
  getotheruserdetails,
  getUserDoubts,
  getUserComments,
  getUserAnswer,
} = require("../controller/Profile");

router.delete("/deleteProfile", auth, deleteAccount);

router.put("/updateProfile", auth, updateProfile);

router.get("/getUserDetails", auth, getUserDetails);
router.get("/getUserPosts", auth, getUserPost);
router.get("/getUserMemberCommunity", auth, getUserMemberCommunity);
router.get("/getUserEntireDetails", auth, getUserEntireDetails);
router.post("/getotheruserdetails", auth, getotheruserdetails);
router.get("/getUserComments", auth, getUserComments);
router.get("/getUserDoubts", auth, getUserDoubts);
router.get("/getUserAnswer", auth, getUserAnswer);

module.exports = router;