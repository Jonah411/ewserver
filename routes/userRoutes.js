const express = require("express");
const router = express.Router();
const {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUserOrg,
} = require("../controllers/userController");

//router.route("/").get(getAllUser).post(createUser);
router.route("/createuser").post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.route("/getorg/:id").get(getUserOrg);

module.exports = router;
