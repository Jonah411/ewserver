const express = require("express");
const { createComponents } = require("../controllers/componentsController");

const router = express.Router();

router.route("/createcomponents").post(createComponents);

module.exports = router;
