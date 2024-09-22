const asyncHandler = require("express-async-handler");
const componentsModel = require("../models/componentsModel");
const { encrypt } = require("../config/EncryptionDecryption");

const createComponents = asyncHandler(async (req, res) => {
  try {
    const { cName, cLocationPath, cOrg } = req.body;

    if (!cName || !cLocationPath) {
      res.status(400).json({
        data: {},
        message: "All fields are mandatory",
        isSuccess: false,
      });
      throw new Error("All fields are mandatory");
    }
    const cNameData = await componentsModel.findOne({
      cName: cName,
    });
    const cLocationPathData = await componentsModel.findOne({
      cLocationPath: cLocationPath,
    });
    if (cNameData) {
      if (cNameData.cName === cName) {
        return res.status(400).json({
          msg: "Dublicate Components Name. Pls Change Components Name.",
          data: {},
          success: false,
        });
      }
    }
    if (cLocationPathData) {
      if (cLocationPathData.cLocationPath === cLocationPath) {
        return res.status(400).json({
          msg: "Dublicate Location Path. Pls Change Location Path.",
          data: {},
          success: false,
        });
      }
    }
    const components = await componentsModel.create({
      cName,
      cLocationPath,
      cOrg: cOrg?.length === 0 ? [] : cOrg,
    });

    res.status(201).json({
      data: components,
      message: "Created components",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      data: {},
      message: "Error creating components",
      isSuccess: false,
    });
  }
});

const getComponentsByOrgId = async (req, res) => {
  const orgId = req.params.orgId;

  try {
    const components = await componentsModel.find({ cOrg: orgId });
    console.log(components);

    if (components.length === 0) {
      return res.status(201).json({
        data: [],
        message: "No components found for this organization.",
        isSuccess: false,
      });
    } else {
      const jsonString = JSON.stringify(components);
      const encryptedData = encrypt(jsonString);
      return res.status(201).json({
        data: encryptedData,
        message: "Get All components Successfully!.",
        isSuccess: true,
      });
    }
  } catch (error) {
    console.error("Error fetching components:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
module.exports = { createComponents, getComponentsByOrgId };
