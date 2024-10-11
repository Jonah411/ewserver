const express = require("express");

const {
  createOrganization,
  getLogo,
  getOrganization,
  getSingleOrganization,
  getAllOrganization,
} = require("../controllers/orgController");

const router = express.Router();

router.route("/createorg").post(createOrganization);

router.get("/organizations/logo/:filename", getLogo);
router.get("/getorg", getOrganization);
router.get("/getAllorg", getAllOrganization);
router.get("/getorg/:id", getSingleOrganization);

module.exports = router;
