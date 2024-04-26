const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.status(200).json(user);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error("All fiels are mandatory");
  }
  const user = await User.create({ name, email });
  res.status(201).json({ data: user, message: "Create user" });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User Not Found.");
  }

  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json({ data: updateUser, message: `Update user for ${req.params.id}` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User Not Found.");
  }
  await User.deleteMany({});
  res.status(201).json(user);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User Not Found.");
  }
  res.status(200).json(user);
});

module.exports = { getAllUser, createUser, updateUser, deleteUser, getUser };
