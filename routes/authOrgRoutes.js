const express = require("express");
const { getAllOrganizationUser } = require("../controllers/authOrgController");

const router = express.Router();

router.get("/getauthorg/:id", getAllOrganizationUser);

module.exports = router;
