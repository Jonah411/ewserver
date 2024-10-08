const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const logoHandler = require("../config/LogoUpload");
const parseJson = require("../helper/JsonHelper");
const userModel = require("../models/userModel");
const rollModel = require("../models/rollModel");
const memberModel = require("../models/memberModel");
const { encrypt } = require("../config/EncryptionDecryption");
const { default: mongoose } = require("mongoose");
const { generateMemberCustomID } = require("../config/generateCustomID");

const createMember = asyncHandler(async (req, res) => {
  logoHandler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message, success: false });
    }
    const confiq = parseJson(req.body);
    const {
      orgId,
      userId,
      rollId,
      name,
      age,
      gender,
      email,
      phoneNo,
      password,
      encPassword,
      userAddress,
      mImageFileName,
    } = confiq;
    let hashedPassword;
    if (encPassword) {
      hashedPassword = encPassword;
    } else {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const userData = await userModel.findOne({
      Organization: orgId,
      _id: userId,
    });
    if (!userData) {
      return res.status(400).json({
        message: "Wrong Organization or User",
        isSuccess: false,
      });
    }
    const memberImage = req.files["memberImage"]
      ? req.files["memberImage"][0]
      : null;

    let rollMemberData = await rollModel.findOne({
      rName: "viewer",
      rOrg: orgId,
    });
    try {
      if (
        !mongoose.Types.ObjectId.isValid(orgId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        return res
          .status(400)
          .json({ msg: "Invalid Organization or User ID.", status: false });
      }

      const memberEmail = await memberModel.findOne({
        Organization: orgId,
        email: email,
      });
      const memberphone = await memberModel.findOne({
        Organization: orgId,
        phoneNo: phoneNo,
      });

      if (memberEmail?.email === email) {
        return res
          .status(400)
          .json({ msg: "Dublicate Email Id. Pls Change Email." });
      }
      if (Number(memberphone?.phoneNo) === Number(phoneNo)) {
        return res
          .status(400)
          .json({ msg: "Dublicate Phone No. Pls Change PhoneNo." });
      }
      const customMemberID = await generateMemberCustomID();
      const newMember = await memberModel.create({
        Organization: userData.Organization,
        User: userData._id,
        name,
        age,
        gender,
        email,
        phoneNo,
        memberImage: mImageFileName ? mImageFileName : memberImage?.filename,
        password: hashedPassword,
        userAddress,
        Roll: rollId ? rollId : rollMemberData._id,
        memberId: customMemberID,
      });
      // const rollMemberDataList = await rollModel.find({});
      const memberDataList = await memberModel
        .find({ Organization: newMember?.Organization, User: newMember?.User })
        .populate("Organization User Roll");
      if (!memberDataList) {
        return res
          .status(404)
          .json({ msg: "Member Not Found.", status: false });
      }
      // const newMemberData = {
      //   rollList: rollMemberDataList,
      //   memberDataList: memberDataList,
      // };
      const jsonString = JSON.stringify(memberDataList);
      const encryptedData = encrypt(jsonString);
      res.status(200).json({
        msg: "Member Create Successfully!",
        status: true,
        data: encryptedData,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ msg: error.message, status: false });
    }
  });
});

const getAllOrgUserMember = asyncHandler(async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(req.params.orgId) ||
      !mongoose.Types.ObjectId.isValid(req.params.userId)
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid Organization or User ID.", status: false });
    }

    const member = await memberModel
      .find({ Organization: req.params.orgId, User: req.params.userId })
      .populate("Organization User Roll");

    if (!member) {
      return res.status(404).json({ msg: "User Not Found.", status: false });
    }

    const jsonString = JSON.stringify(member);
    const encryptedData = encrypt(jsonString);
    res.status(200).json({
      msg: "Get All Org User Successfully!",
      status: true,
      data: encryptedData,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ msg: error.message, status: false });
  }
});

const getAllOrgMember = asyncHandler(async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orgId)) {
      return res
        .status(400)
        .json({ msg: "Invalid Organization ID.", status: false });
    }

    const member = await memberModel
      .find({ Organization: req.params.orgId })
      .populate("Organization User Roll");

    if (!member) {
      return res.status(404).json({ msg: "member Not Found.", status: false });
    }

    const jsonString = JSON.stringify(member);
    const encryptedData = encrypt(jsonString);
    res.status(200).json({
      msg: "Get All Org User Successfully!",
      status: true,
      data: encryptedData,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ msg: error.message, status: false });
  }
});

module.exports = {
  createMember,
  getAllOrgUserMember,
  getAllOrgMember,
};
