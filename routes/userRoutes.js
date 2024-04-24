const express = require("express");
const router = express.Router();
const {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/userController");

router.route("/").get(getAllUser).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
