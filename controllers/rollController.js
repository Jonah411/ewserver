const asyncHandler = require("express-async-handler");
const Roll = require("../models/rollModel");

const createRoll = asyncHandler(async (req, res) => {
  try {
    const { rName, fAccess } = req.body;

    console.log("Request Body:", req.body);

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

module.exports = { createRoll };
