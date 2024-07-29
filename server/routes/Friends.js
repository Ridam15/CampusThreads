const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {
  getallFriends,
  getallreqsent,
  getallreqrec,
  sendreq,
  delreq,
  acceptreq,
  declinereq,
  unFriend,
} = require("../controller/Friends");

router.get("/getallFriends", auth, getallFriends);
router.get("/getallreqsent", auth, getallreqsent);
router.get("/getallreqrec", auth, getallreqrec);
router.post("/sendreq", auth, sendreq);
router.post("/delreq", auth, delreq);
router.post("/acceptreq", auth, acceptreq);
router.post("/declinereq", auth, declinereq);
router.post("/unFriend", auth, unFriend);

module.exports = router;