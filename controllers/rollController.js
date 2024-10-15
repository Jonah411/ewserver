const asyncHandler = require("express-async-handler");
const Roll = require("../models/rollModel");
const { encrypt } = require("../config/EncryptionDecryption");
const orgTypeRollModel = require("../models/orgTypeRollModel");

const createRoll = asyncHandler(async (req, res) => {
  try {
    const { rName, fAccess } = req.body;

    if (!rName || !fAccess) {
      res.status(400).json({
        data: {},
        message: "All fields are mandatory",
        isSuccess: false,
      });
      throw new Error("All fields are mandatory");
    }

    const roll = await Roll.create({ rName, fAccess });

    res
      .status(201)
      .json({ data: roll, message: "Created Roll", isSuccess: true });
  } catch (error) {
    res
      .status(500)
      .json({ data: {}, message: "Error creating roll", isSuccess: false });
  }
});

const getAllRoll = asyncHandler(async (req, res) => {
  const orgId = req.params.id;
  const roll = await Roll.find({ rOrg: orgId }).populate("rMenu");
  const jsonString = JSON.stringify(roll);
  const encryptedData = encrypt(jsonString);
  res.status(201).json({
    data: encryptedData,
    message: "Get All Menu Successfully!.",
    isSuccess: true,
  });
});

const updateRoll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rName, rMenu } = req.body;
  const roll = await Roll.findById(id);
  if (!roll) {
    res.status(400).json({
      data: {},
      message: "Roll not found",
      isSuccess: false,
    });
    throw new Error("Roll not found");
  }
  roll.rName = rName || roll.rName;
  roll.rMenu = rMenu || roll.rMenu;
  const updatedRoll = await roll.save();
  const jsonString = JSON.stringify(updatedRoll);
  const encryptedData = encrypt(jsonString);
  res.status(201).json({
    data: encryptedData,
    message: "Roll updated successfully",
    isSuccess: true,
  });
});

const updateAllRoll = asyncHandler(async (req, res) => {
  const rollData = req.body;

  if (!Array.isArray(rollData)) {
    return res.status(400).json({
      message: "Invalid input, expected an array of rolls",
      isSuccess: false,
    });
  }

  const updatedRolls = await Promise.all(
    rollData.map(async (li) => {
      const rMenu = li?.rMenu;
      const roll = await Roll.findById({ _id: li?._id, rOrg: li?.rOrg });

      if (!roll) {
        throw new Error(`Roll with ID ${li?._id} not found`);
      }

      roll.rMenu = rMenu || roll.rMenu;

      const updatedRoll = await roll.save();

      return Roll.populate(updatedRoll, { path: "rMenu" });
    })
  );

  const jsonString = JSON.stringify(updatedRolls);

  const encryptedData = encrypt(jsonString);

  res.status(200).json({
    data: encryptedData,
    message: "All rolls updated successfully",
    isSuccess: true,
  });
});

const getAllOTRoll = asyncHandler(async (req, res) => {
  const orgId = req.params.orgid;
  const orgTypeId = req.params.orgtypeid;

  const roll = await orgTypeRollModel.find({ Org: orgId, OrgType: orgTypeId });

  const jsonString = JSON.stringify(roll);
  const encryptedData = encrypt(jsonString);
  res.status(201).json({
    data: encryptedData,
    message: "Get All Menu Successfully!.",
    isSuccess: true,
  });
});

const updateAllRollOrgType = asyncHandler(async (req, res) => {
  const rollData = req.body;

  if (!Array.isArray(rollData)) {
    return res.status(400).json({
      message: "Invalid input, expected an array of rolls",
      isSuccess: false,
    });
  }

  const updatedRolls = await Promise.all(
    rollData.map(async (li) => {
      const Menu = li?.Menu;
      const roll = await orgTypeRollModel.findById({
        _id: li?._id,
        Org: li?.Org,
        OrgType: li?.OrgType,
      });

      if (!roll) {
        throw new Error(`Roll with ID ${li?._id} not found`);
      }

      roll.Menu = Menu || roll.Menu;

      const updatedRoll = await roll.save();

      return orgTypeRollModel.populate(updatedRoll, { path: "Menu" });
    })
  );
  const jsonString = JSON.stringify(updatedRolls);

  const encryptedData = encrypt(jsonString);

  res.status(200).json({
    data: encryptedData,
    message: "All rolls updated successfully",
    isSuccess: true,
  });
});

module.exports = {
  createRoll,
  getAllRoll,
  updateRoll,
  updateAllRoll,
  getAllOTRoll,
  updateAllRollOrgType,
};
