const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const logoHandler = require("../config/LogoUpload");

const User = require("../models/userModel");
const Roll = require("../models/rollModel");
const Organization = require("../models/orgModel");
const { encrypt } = require("../config/EncryptionDecryption");
const userModel = require("../models/userModel");
const rollModel = require("../models/rollModel");
const parseJson = require("../helper/JsonHelper");
const { generateUserCustomID } = require("../config/generateCustomID");

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
  const user = await User.find({ Organization: req.params.id }).select(
    "name email Organization"
  );

  if (!user) {
    res.status(404);
    throw new Error("User Not Found.");
  }
  res.status(200).json({
    msg: "Get Selected User Successfully!",
    status: true,
    data: user,
  });
});

const getUserOrg = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("Organization");

  if (!user) {
    res.status(404);
    throw new Error("User Not Found.");
  }

  res.status(200).json({
    msg: "User and organization retrieved successfully!",
    status: true,
    data: user,
  });
});

const getSingleUser = asyncHandler(async (req, res) => {
  let user;
  if (req.params.id) {
    user = await User.findById({ _id: req.params.id }).populate(
      "Organization Roll"
    );
  }

  if (!user) {
    res.status(404);
    throw new Error("User Not Found.");
  }
  const jsonString = JSON.stringify(user);
  const encryptedData = encrypt(jsonString);
  res.status(200).json({
    msg: "Get Selected User Successfully!",
    status: true,
    data: encryptedData,
  });
});

const getAllOrgUser = asyncHandler(async (req, res) => {
  const user = await User.find({ Organization: req.params.id }).populate(
    "Organization Roll"
  );

  if (!user) {
    res.status(404);
    throw new Error("User Not Found.");
  }
  const jsonString = JSON.stringify(user);
  const encryptedData = encrypt(jsonString);
  res.status(200).json({
    msg: "Get All Org User Successfully!",
    status: true,
    data: encryptedData,
  });
});

const createUserMember = asyncHandler(async (req, res) => {
  logoHandler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message, success: false });
    }
    const confiq = parseJson(req.body);
    const {
      orgId,
      name,
      age,
      gender,
      email,
      phoneNo,
      password,
      encPassword,
      userAddress,
      uImageFileName,
    } = confiq;
    let hashedPassword;
    if (encPassword) {
      hashedPassword = encPassword;
    } else {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const userData = await userModel.findOne({
      Organization: orgId,
    });
    if (!userData) {
      return res.status(400).json({
        message: "Wrong Organization",
        isSuccess: false,
      });
    }
    const userImage = req.files["userImage"] ? req.files["userImage"][0] : null;

    let rollUserData = await rollModel.findOne({
      rName: "user",
      rOrg: orgId,
    });

    try {
      if (!mongoose.Types.ObjectId.isValid(orgId)) {
        return res
          .status(400)
          .json({ msg: "Invalid Organization.", status: false });
      }

      const user = await userModel.findOne({
        Organization: orgId,
      });
      if (user) {
        if (user.email === email) {
          return res
            .status(400)
            .json({ msg: "Dublicate Email Id. Pls Change Email." });
        }
        if (user.phoneNo === phoneNo) {
          return res
            .status(400)
            .json({ msg: "Dublicate Phone No. Pls Change Phone No." });
        }
      }
      const customUserID = await generateUserCustomID();

      const newUser = await userModel.create({
        Organization: userData.Organization,
        name,
        age,
        gender,
        email,
        phoneNo,
        userImage: uImageFileName ? uImageFileName : userImage?.filename,
        password: hashedPassword,
        userAddress,
        Roll: rollUserData._id,
        userId: customUserID,
      });
      const userDataList = await userModel
        .find({ Organization: newUser?.Organization })
        .populate("Organization Roll");
      if (!userDataList) {
        return res.status(404).json({ msg: "User Not Found.", status: false });
      }

      const jsonString = JSON.stringify(userDataList);
      const encryptedData = encrypt(jsonString);
      res.status(200).json({
        msg: "User Create Successfully!",
        status: true,
        data: encryptedData,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ msg: error.message, status: false });
    }
  });
});

module.exports = {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  getUserOrg,
  getUser,
  getSingleUser,
  getAllOrgUser,
  createUserMember,
};
