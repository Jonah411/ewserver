const express = require("express");
const {
  createUserMemberOTP,
  createMemberOTP,
} = require("../controllers/userController");
const router = express.Router();

router.route("/createOTP").post(createUserMemberOTP);
router.route("/createMemberOTP").post(createMemberOTP);

module.exports = router;
