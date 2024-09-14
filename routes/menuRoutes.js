const express = require("express");
const { createMenu, getAllMenu } = require("../controllers/menuController");
const {
  getAllRoll,
  updateRoll,
  updateAllRoll,
} = require("../controllers/rollController");
const router = express.Router();

//router.post("/createroll", createRoll);
router.route("/createmenu").post(createMenu);
router.route("/getallrolls").get(getAllRoll);
router.route("/getallmenus").get(getAllMenu);

router.put("/updateroll/:id", updateRoll);
router.post("/updateallroll", updateAllRoll);

module.exports = router;
