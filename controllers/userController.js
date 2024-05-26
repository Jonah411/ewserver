const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const Roll = require("../models/rollModel");
const Organization = require("../models/orgModel");

const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.status(200).json(user);
});

const createUser = asyncHandler(async (req, res) => {
  const { orgId, name, age, gender, email, phoneNo, password } = req.body;

  try {
    // Find organization data
    const orgData = await Organization.findOne({ _id: orgId });
    if (!orgData) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find viewer role data
    const rollData = await Roll.findOne({ rName: "viewer" });
    if (!rollData) {
      return res.status(404).json({ message: "Viewer role not found" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      Organization: orgData._id,
      name,
      age,
      gender,
      email,
      phoneNo,
      password: hashedPassword,
      Roll: rollData._id,
    });

    res.status(201).json({
      data: user,
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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
