const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  getPosts,
} = require("../controller/Post");

const { likePost, unlikePost } = require("../controller/PostLike");

router.post("/create", auth, createPost);
router.put("/update", auth, updatePost);
router.post("/delete", auth, deletePost);
router.post("/details", auth, getPostDetails);
router.get("/getAllPosts", auth, getPosts);

router.post("/like", auth, likePost);
router.post("/unlike", auth, unlikePost);

module.exports = router;
