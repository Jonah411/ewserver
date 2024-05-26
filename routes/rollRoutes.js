const express = require("express");

const { createRoll } = require("../controllers/rollController");
const router = express.Router();

//router.post("/createroll", createRoll);
router.route("/createroll").post(createRoll);

module.exports = router;
