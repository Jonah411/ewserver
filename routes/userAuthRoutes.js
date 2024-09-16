const express = require("express");
const {
  getSingleUser,
  getAllOrgUser,
  createUserMember,
} = require("../controllers/userController");
const router = express.Router();

router.route("/:id").get(getSingleUser);
router.route("/org/:id").get(getAllOrgUser);
router.route("/createuser").post(createUserMember);

module.exports = router;
