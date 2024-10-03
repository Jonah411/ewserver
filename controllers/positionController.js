const { encrypt } = require("../config/EncryptionDecryption");
const { generatePositionCustomID } = require("../config/generateCustomID");
const OrgPosition = require("../models/orgpositionModel");
const Position = require("../models/positionModel");
const positionModel = require("../models/positionModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const createPosition = async (req, res) => {
  try {
    const { pName, pCount, pMember, orgId } = req.body;

    // Validate input
    if (!pName || !pCount || !orgId) {
      return res
        .status(400)
        .json({ message: "pName, pCount, and orgId are required." });
    }
    const existingPosition = await positionModel.findOne({
      pName,
      Organization: orgId,
    });
    if (existingPosition) {
      return res.status(409).json({
        message: "Position with this name already exists in the organization.",
      });
    }
    const customPositionID = await generatePositionCustomID();
    const newPosition = new positionModel({
      pName,
      pCount,
      Organization: orgId,
      pMember: pMember.map((memberId) => memberId),
      positionId: customPositionID,
    });

    // Save the position
    await newPosition.save();

    const PositionList = await OrgPosition.find({
      Organization: orgId,
    }).populate("Position Organization");

    const jsonString = JSON.stringify(PositionList);
    const encryptedData = encrypt(jsonString);
    res.status(200).json({
      msg: "Create Position Successfully!",
      status: true,
      data: encryptedData,
    });
  } catch (error) {
    console.error("Error creating position:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getAllOrgPos = asyncHandler(async (req, res) => {
  const orgId = req.params.id;
  const PositionList = await OrgPosition.findOne({
    Organization: orgId,
  })
    .populate({
      path: "Position",
      populate: {
        path: "pMember",
        model: "Member",
        populate: {
          path: "Roll",
          model: "Roll",
        },
      },
    })
    .populate("Organization");

  const jsonString = JSON.stringify(PositionList);
  const encryptedData = encrypt(jsonString);
  res.status(200).json({
    msg: "Get Position Successfully!",
    status: true,
    data: encryptedData,
  });
});

const updatePosition = asyncHandler(async (req, res) => {
  const positionsToUpdate = req.body;
  try {
    const updatePromises = positionsToUpdate.map(async (position) => {
      const { _id, pName, pCount, Organization, pMember } = position;

      return await Position.findByIdAndUpdate(
        _id,
        {
          pName,
          pCount,
          Organization,
          pMember,
        },
        { new: true, runValidators: true }
      );
    });

    // Wait for all updates to complete
    const updatedPositions = await Promise.all(updatePromises);
    const jsonString = JSON.stringify(updatedPositions);
    const encryptedData = encrypt(jsonString);
    res.status(200).json({
      msg: "Update Position Successfully!",
      status: true,
      data: encryptedData,
    });
  } catch (error) {
    // Handle any errors that occur during the update
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const removePosition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPosition = await Position.findByIdAndDelete(id);

    if (!deletedPosition) {
      return res.status(404).json({ message: "Position not found" });
    }
    const PositionList = await OrgPosition.find({
      Organization: deletedPosition?.Organization,
    }).populate("Position Organization");

    const jsonString = JSON.stringify(PositionList);
    const encryptedData = encrypt(jsonString);
    res.status(200).json({
      msg: "Position deleted successfully!",
      status: true,
      data: encryptedData,
    });
  } catch (error) {
    // Handle any errors that occur during the deletion
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = {
  createPosition,
  getAllOrgPos,
  updatePosition,
  removePosition,
};
