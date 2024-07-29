const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controller/Comment");

const { likeComment, unlikeComment } = require("../controller/CommentLike");

router.post("/create", auth, createComment);
router.put("/update", auth, updateComment);
router.post("/delete", auth, deleteComment);

router.post("/like", auth, likeComment);
router.post("/unlike", auth, unlikeComment);

module.exports = router;
