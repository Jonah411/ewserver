const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json("user");
});

const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json("user");
});

const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json("user");
});

module.exports = { registerUser, loginUser, currentUser };
