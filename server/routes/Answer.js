const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  markCorrectAnswer,
  unmarkCorrectAnswer,
} = require("../controller/Answer");

const { likeAnswer, unlikeAnswer } = require("../controller/AnswerLike");

router.post("/create", auth, createAnswer);
router.put("/update", auth, updateAnswer);
router.post("/delete", auth, deleteAnswer);

router.post("/like", auth, likeAnswer);
router.post("/unlike", auth, unlikeAnswer);

router.post("/markCorrectAnswer", auth, markCorrectAnswer);
router.post("/unmarkCorrectAnswer", auth, unmarkCorrectAnswer);

module.exports = router;
