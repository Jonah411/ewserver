const asyncHandler = require("express-async-handler");
const Organization = require("../models/orgModel");
const User = require("../models/userModel");
const Roll = require("../models/rollModel");
const { gfs } = require("../config/LogoUpload");
const logoHandler = require("../config/LogoUpload");
const parseJson = require("../helper/JsonHelper");

exports.currentOrg = asyncHandler(async (req, res) => {
  res.status(200).json("user");
});

exports.createOrganization = asyncHandler(async (req, res) => {
  debugger;
  logoHandler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message, success: false });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded", success: false });
    }

    const confiq = parseJson(req.body);

    const { filename } = req.file;

    const {
      orgName,
      orgPlace,
      orgAddress,
      orgMembersCount,
      orgDescription,
      orgYear,
      orgMebAgeFrom,
      orgMebAgeTo,
    } = confiq;
    const organizationData = await Organization.findOne({
      orgName: orgName,
    });
    console.log(organizationData);

    if (!organizationData) {
      const newOrg = new Organization({
        orgName,
        orgPlace,
        orgAddress,
        orgMembersCount,
        orgLogo: filename,
        orgDescription,
        orgYear,
        orgMebAgeFrom,
        orgMebAgeTo,
      });

      const savedOrg = await newOrg.save();

      if (savedOrg) {
        const rollData = await Roll.findOne({
          rName: "admin",
        });
        const newUser = new User({
          Organization: savedOrg._id,
          name: savedOrg.orgName,
          age: 20,
          gender: "male",
          email: "admin@gmail.com",
          phoneNo: 9999999999,
          password: "admin",
          Roll: rollData._id,
        });
        await newUser.save();
      }
      res.status(201).json({
        msg: "Organization create successfully!",
        data: savedOrg,
        success: true,
      });
    } else {
      res.status(400).json({
        msg: "Organization Already created!",
        data: {},
        success: false,
      });
    }
  });
});

exports.getLogo = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  const files = await gfs.find({ filename }).toArray();
  if (!files || files.length === 0) {
    return res.status(404).json({
      err: "No files exist",
    });
  }

  gfs.openDownloadStreamByName(filename).pipe(res);
});

exports.getOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.find({});
  res.status(200).json({
    msg: "Get all organization Successfully!",
    status: true,
    data: organization,
    path: "/app/image",
  });
});

exports.getSingleOrganization = asyncHandler(async (req, res) => {
  console.log(req.params);
  const organization = await Organization.find({ _id: req.params.id });
  res.status(200).json({
    msg: "Get all organization Successfully!",
    status: true,
    data: organization,
    path: "/app/image",
  });
});
