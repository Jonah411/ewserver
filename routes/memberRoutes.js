const express = require("express");
const {
  createMember,
  getAllOrgUserMember,
  getAllOrgMember,
} = require("../controllers/memberController");
const router = express.Router();

//router.post("/createroll", createRoll);
router.route("/create_member").post(createMember);
router.route("/get_member/:orgId/:userId").get(getAllOrgUserMember);
router.route("/get_member/:orgId").get(getAllOrgMember);

module.exports = router;
