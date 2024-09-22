const express = require("express");
const { getComponentsByOrgId } = require("../controllers/componentsController");

const router = express.Router();

router.route("/:orgId").get(getComponentsByOrgId);

module.exports = router;
