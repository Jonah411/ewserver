const express = require("express");

const {
  createOrganization,
  getLogo,
  getOrganization,
  getSingleOrganization,
} = require("../controllers/orgController");
// const { upload } = require("../config/multerConfig");
// const validateLogoImageDimensions = require("../middleware/validateLogoImageDimensions ");
const router = express.Router();

// // router.post("/create", upload, validateLogoImageDimensions, createOrganization);
router.route("/createorg").post(
  // upload.single("orgLogo"),
  //   validateLogoImageDimensions,
  createOrganization
);

router.get("/organizations/logo/:filename", getLogo);
router.get("/getorg", getOrganization);
router.get("/getorg/:id", getSingleOrganization);

module.exports = router;
