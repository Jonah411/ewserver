const asyncHandler = require("express-async-handler");
const Organization = require("../models/orgModel");
const User = require("../models/userModel");
const Roll = require("../models/rollModel");
const { gfs } = require("../config/LogoUpload");
const logoHandler = require("../config/LogoUpload");
const parseJson = require("../helper/JsonHelper");
const bcrypt = require("bcryptjs");
const {
  generateOrgCustomID,
  generateUserCustomID,
} = require("../config/generateCustomID");
const { SendVerificationCode } = require("../middleware/Email");
const { encrypt } = require("../config/EncryptionDecryption");
const userModel = require("../models/userModel");

exports.currentOrg = asyncHandler(async (req, res) => {
  res.status(200).json("user");
});

exports.createOrganization = asyncHandler(async (req, res) => {
  logoHandler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message, success: false });
    }

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
      orgDisplayName,
    } = confiq;
    const {
      name,
      age,
      gender,
      email,
      phoneNo,
      password,
      userAddress,
      marraigestatus,
      marraigedate,
      dob,
    } = confiq;
    const hashedPassword = await bcrypt.hash(password, 10);
    const organizationData = await Organization.findOne({
      orgName: orgName,
    });

    const orgLogo = req.files["orgLogo"] ? req.files["orgLogo"][0] : null;
    const userImage = req.files["userImage"] ? req.files["userImage"][0] : null;

    if (!organizationData) {
      const customOrgID = await generateOrgCustomID();

      Organization.create({
        orgName,
        orgPlace,
        orgAddress,
        orgMembersCount,
        orgLogo: orgLogo ? orgLogo?.filename : "",
        orgDescription,
        orgYear,
        orgMebAgeFrom,
        orgMebAgeTo,
        orgDisplayName,
        orgId: customOrgID,
      })
        .then(async (org) => {
          if (org) {
            await Roll.create([
              {
                rName: "admin",
                rAccess: "F",
                rMenu: [],
                rOrg: org._id,
              },
              {
                rName: "user",
                rAccess: "H",
                rMenu: [],
                rOrg: org._id,
              },
              {
                rName: "member",
                rAccess: "W",
                rMenu: [],
                rOrg: org._id,
              },
              {
                rName: "viewer",
                rAccess: "R",
                rMenu: [],
                rOrg: org._id,
              },
            ]);
            const userEmail = await User.findOne({
              email: email,
            });
            const userPhoneNO = await User.findOne({
              phoneNo: phoneNo,
            });
            if (userEmail) {
              if (userEmail.email === email) {
                return res.status(400).json({
                  msg: "Dublicate Email Id. Pls Change Email.",
                  data: {},
                  success: false,
                });
              }
            }
            if (userPhoneNO) {
              if (userPhoneNO.phoneNo === phoneNo) {
                return res.status(400).json({
                  msg: "Dublicate phoneNo. Pls Change phoneNo.",
                  data: {},
                  success: false,
                });
              }
            }
            const rollAdminData = await Roll.findOne({
              rName: "admin",
              rOrg: org._id,
            });
            const customUserID = await generateUserCustomID();
            const verificationEmailCode = Math.floor(
              100000 + Math.random() * 900000
            ).toString();
            User.create({
              Organization: org._id,
              name,
              age,
              gender,
              email,
              marraigestatus,
              marraigedate,
              dob,
              phoneNo,
              userAddress,
              userImage: userImage?.filename,
              password: hashedPassword,
              Roll: rollAdminData._id,
              userId: customUserID,
              verificationEmailCode: verificationEmailCode,
            }).then(async (user) => {
              const userDataList = await userModel
                .findOne({
                  Organization: user?.Organization,
                  email: user?.email,
                })
                .populate("Organization Roll", "_id")
                .select("_id userId email phoneNo Organization");

              if (!userDataList) {
                return res
                  .status(404)
                  .json({ msg: "User Not Found.", status: false });
              }
              const mailResponse = await SendVerificationCode(
                email,
                verificationEmailCode
              );
              if (mailResponse) {
                const jsonString = JSON.stringify(userDataList);
                const encryptedData = encrypt(jsonString);
                res.status(200).json({
                  msg: "OTP send to Mail Successfully!",
                  status: true,
                  data: encryptedData,
                });
              } else {
                res.status(400).json({
                  msg: "OTP not send!",
                  status: true,
                  data: encryptedData,
                });
              }
            });
          }
        })
        .catch((err) => {
          console.error("Error creating user:", err);
        });
    } else {
      const rollMemberData = await Roll.findOne({
        rName: "viewer",
        rOrg: organizationData._id,
      });
      const customUserID = await generateUserCustomID();
      const verificationEmailCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      User.create({
        Organization: organizationData._id,
        name,
        age,
        gender,
        email,
        phoneNo,
        marraigestatus,
        marraigedate,
        dob,
        userImage: userImage?.filename,
        password: hashedPassword,
        userAddress,
        Roll: rollMemberData._id,
        userId: customUserID,
        verificationEmailCode: verificationEmailCode,
      }).then(async (user) => {
        const userDataList = await userModel
          .findOne({
            Organization: user?.Organization,
            email: user?.email,
          })
          .populate("Organization Roll", "_id")
          .select("_id userId email phoneNo Organization");

        if (!userDataList) {
          return res
            .status(404)
            .json({ msg: "User Not Found.", status: false });
        }
        const mailResponse = await SendVerificationCode(
          email,
          verificationEmailCode
        );
        if (mailResponse) {
          const jsonString = JSON.stringify(userDataList);
          const encryptedData = encrypt(jsonString);
          res.status(200).json({
            msg: "OTP send to Mail Successfully!",
            status: true,
            data: encryptedData,
          });
        } else {
          res.status(400).json({
            msg: "OTP not send!",
            status: true,
            data: encryptedData,
          });
        }
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

exports.getAllOrganization = asyncHandler(async (req, res) => {
  const organizations = await Organization.find()
    .populate("orgType", "_id tName tId")
    .select("_id orgId orgName");
  const jsonString = JSON.stringify(organizations);
  const encryptedData = encrypt(jsonString);
  res.status(200).json({
    msg: "Get all organization Successfully!",
    status: true,
    data: organizations,
    path: "/app/image",
  });
});

exports.getSingleOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.find({ _id: req.params.id });
  res.status(200).json({
    msg: "Get all organization Successfully!",
    status: true,
    data: organization,
    path: "/app/image",
  });
});
