const express = require("express");
const { getSingleUser } = require("../controllers/userController");
const router = express.Router();

router.route("/:id").get(getSingleUser);

module.exports = router;
