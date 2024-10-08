const express = require("express");
const {
  getSingleUser,
  getAllOrgUser,
  createUserMember,
  createUserMemberOTP,
} = require("../controllers/userController");
const router = express.Router();

router.route("/:id").get(getSingleUser);
router.route("/org/:id").get(getAllOrgUser);
router.route("/createuser").post(createUserMember);
router.route("/createOTP").post(createUserMemberOTP);

module.exports = router;
