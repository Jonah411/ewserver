const asyncHandler = require("express-async-handler");
const orgTypeModel = require("../models/orgTypeModel");
const { generateOrgTypeCustomID } = require("../config/generateCustomID");
const { encrypt } = require("../config/EncryptionDecryption");
const orgTypeRollModel = require("../models/orgTypeRollModel");
const memberModel = require("../models/memberModel");
const orgModel = require("../models/orgModel");

const createOrgType = asyncHandler(async (req, res) => {
  try {
    const {
      tName,
      tPlace,
      tYear,
      tStartAge,
      tEndAge,
      tAddress,
      tGender,
      tOrg,
      tMember,
    } = req.body;
    const orgType = await orgTypeModel.findOne({
      tName: tName,
    });
    if (orgType) {
      if (orgType.tName === tName) {
        return res.status(400).json({
          msg: "Dublicate Org Type Name. Pls Change Name.",
          data: {},
          success: false,
        });
      }
    }
    const customTID = await generateOrgTypeCustomID();
    const otype = await orgTypeModel.create({
      tName,
      tPlace,
      tYear,
      tStartAge,
      tEndAge,
      tAddress,
      tGender,
      tOrg,
      tMember,
      tId: customTID,
    });
    await orgTypeRollModel.create([
      {
        otrName: "admin",
        otrAccess: "F",
        Menu: [],
        Org: otype.tOrg,
        OrgType: otype._id,
      },

      {
        otrName: "member",
        otrAccess: "H",
        Menu: [],
        Org: otype.tOrg,
        OrgType: otype._id,
      },
      {
        otrName: "viewer",
        otrAccess: "R",
        Menu: [],
        Org: otype.tOrg,
        OrgType: otype._id,
      },
    ]);
    const rollAdminData = await orgTypeRollModel.findOne({
      otrName: "admin",
      Org: otype.tOrg,
      OrgType: otype._id,
    });

    await memberModel.updateMany(
      { _id: { $in: tMember } },
      { $addToSet: { orgtypeRoll: rollAdminData?._id, orgtype: otype._id } }
    );
    await orgModel.findByIdAndUpdate(
      otype.tOrg,
      { $addToSet: { orgType: otype._id } },
      { new: true }
    );
    const jsonString = JSON.stringify(otype);
    const encryptedData = encrypt(jsonString);
    res.status(201).json({
      data: encryptedData,
      msg: "Created OrgType Successfully!.",
      isSuccess: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ data: {}, message: "Error creating roll", isSuccess: false });
  }
});

module.exports = { createOrgType };
