const express = require("express");
const {
  createMember,
  getAllOrgUserMember,
} = require("../controllers/memberController");
const router = express.Router();

//router.post("/createroll", createRoll);
router.route("/create_member").post(createMember);
router.route("/get_member/:orgId/:userId").get(getAllOrgUserMember);

module.exports = router;
