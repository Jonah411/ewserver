const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Member = require("../models/memberModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const secret = "workeasy0409";
const refreshSecret = "refreshworkeasy0409";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json("user");
});

const loginUser = asyncHandler(async (req, res) => {
  const { organization, email, password } = req.body;
  let userData = await Member.findOne({
    Organization: organization,
    email: email,
  })
    .populate("Organization")
    .populate("Roll");
  if (!userData) {
    userData = await User.findOne({
      Organization: organization,
      email: email,
    })
      .populate("Organization")
      .populate("Roll");
  }

  if (!userData) {
    return res.status(400).json({ msg: "mismatch Organization and Email" });
  }
  const organizationId = new ObjectId(organization);

  if (!userData.Organization._id.equals(organizationId)) {
    return res.status(400).json({ msg: "Invalid organization credentials" });
  }

  if (userData.email !== email) {
    return res.status(400).json({ msg: "Invalid email credentials" });
  }

  const isMatch = await bcrypt.compare(password, userData.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid password credentials" });
  }
  const token = jwt.sign({ username: userData.name }, secret, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ username: userData.name }, refreshSecret, {
    expiresIn: "1d",
  });
  res.status(200).json({
    msg: "Login Successfull!",
    data: { token, refreshToken, userData },
  });
  // res.json({ token, refreshToken });
});

const refreshToken = async (req, res) => {
  const { token: refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const newToken = jwt.sign({ username: decoded.username }, secret, {
      expiresIn: "1h",
    });
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ msg: "Invalid refresh token" });
  }
};

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    msg: "Logout Successfull!",
    data: { token: "", refreshToken: "" },
  });
});

const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json("user");
});

const loginOrgType = asyncHandler(async (req, res) => {
  const { org, orgType, email, password } = req.body;
  let userData = await Member.findOne({
    Organization: org,
    orgtype: { $in: [orgType] },
    email: email,
  }).populate("Organization");

  if (!userData) {
    return res.status(400).json({ msg: "mismatch Organization and Email" });
  }
  const organizationId = new ObjectId(org);
  const orgTypeId = new ObjectId(orgType);

  if (!userData.Organization._id.equals(organizationId)) {
    return res.status(400).json({ msg: "Invalid organization credentials" });
  }
  const orgTypeMatch = userData.orgtype.some((orgType) =>
    orgType.equals(orgTypeId)
  );

  if (!orgTypeMatch) {
    return res.status(400).json({ msg: "Invalid orgType credentials" });
  }
  if (userData.email !== email) {
    return res.status(400).json({ msg: "Invalid email credentials" });
  }

  const isMatch = await bcrypt.compare(password, userData.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid password credentials" });
  }
  const token = jwt.sign({ username: userData.name }, secret, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ username: userData.name }, refreshSecret, {
    expiresIn: "1d",
  });
  res.status(200).json({
    msg: "Login Successfull!",
    data: { token, refreshToken, userData },
  });
  // res.json({ token, refreshToken });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  refreshToken,
  logout,
  loginOrgType,
};
