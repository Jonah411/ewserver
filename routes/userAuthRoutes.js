const express = require("express");
const {
  getSingleUser,
  getAllOrgUser,
} = require("../controllers/userController");
const router = express.Router();

router.route("/:id").get(getSingleUser);
router.route("/org/:id").get(getAllOrgUser);

module.exports = router;
