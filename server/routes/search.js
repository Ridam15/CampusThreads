const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {
  searchuser,
  searchpost,
} = require("../controller/search");

router.get("/searchuser/:username", auth, searchuser);
router.get("/searchpost/:keyword", auth, searchpost);

module.exports = router;