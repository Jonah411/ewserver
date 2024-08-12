const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  refreshToken,
  logout,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", currentUser);
router.post("/refresh-token", refreshToken);
router.get("/logout", logout);

module.exports = router;
