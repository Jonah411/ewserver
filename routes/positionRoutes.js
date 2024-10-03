const express = require("express");
const {
  createPosition,
  getAllOrgPos,
  updatePosition,
  removePosition,
} = require("../controllers/positionController");

const router = express.Router();

router.route("/createposition").post(createPosition);
router.route("/updateposition").put(updatePosition);
router.route("/getposition/:id").get(getAllOrgPos);
router.route("/removeposition/:id").delete(removePosition);

module.exports = router;
