const express = require("express");
const { createOrgType } = require("../controllers/orgTypeController");

const router = express.Router();

router.route("/create_orgType").post(createOrgType);

module.exports = router;
