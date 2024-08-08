const asyncHandler = require("express-async-handler");
const Organization = require("../models/orgModel");
const User = require("../models/userModel");
const Roll = require("../models/rollModel");
const { gfs } = require("../config/LogoUpload");
const logoHandler = require("../config/LogoUpload");
const parseJson = require("../helper/JsonHelper");
const bcrypt = require("bcryptjs");

exports.currentOrg = asyncHandler(async (req, res) => {
  res.status(200).json("user");
});

exports.createOrganization = asyncHandler(async (req, res) => {
  logoHandler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message, success: false });
    }

    // if (!req.file) {
    //   return res.status(400).json({ msg: "No file uploaded", success: false });
    // }

    const confiq = parseJson(req.body);

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
    const { name, age, gender, email, phoneNo, password } = confiq;
    const hashedPassword = await bcrypt.hash(password, 10);
    const organizationData = await Organization.findOne({
      orgName: orgName,
    });

    if (!organizationData) {
      Organization.create({
        orgName,
        orgPlace,
        orgAddress,
        orgMembersCount,
        orgLogo: req.file.filename ? req.file.filename : "",
        orgDescription,
        orgYear,
        orgMebAgeFrom,
        orgMebAgeTo,
      })
        .then(async (org) => {
          if (org) {
            const rollAdminData = await Roll.findOne({
              rName: "admin",
            });

            User.create({
              Organization: org._id,
              name,
              age,
              gender,
              email,
              phoneNo,
              password: hashedPassword,
              Roll: rollAdminData._id,
            }).then((user) => {
              res.status(201).json({
                msg: "Organization & User Create successfully!",
                data: { organization: org, user: user },
                success: false,
              });
            });
          }
        })
        .catch((err) => {
          console.error("Error creating user:", err);
        });
    } else {
      const rollMemberData = await Roll.findOne({
        rName: "member",
      });
      User.create({
        Organization: organizationData._id,
        name,
        age,
        gender,
        email,
        phoneNo,
        password: hashedPassword,
        Roll: rollMemberData._id,
      }).then((user) => {
        res.status(201).json({
          msg: "User Create Succesfully!",
          data: { organization: organizationData, user: user },
          success: false,
        });
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
