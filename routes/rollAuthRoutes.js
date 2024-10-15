const express = require("express");
const {
  getAllOTRoll,
  updateAllRollOrgType,
} = require("../controllers/rollController");

const router = express.Router();

//router.post("/createroll", createRoll);
// router.route("/createroll").post(createRoll);

router.route("/getallrolls/:orgid/:orgtypeid").get(getAllOTRoll);
router.post("/updateallroll", updateAllRollOrgType);

module.exports = router;
