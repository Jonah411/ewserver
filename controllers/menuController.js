const asyncHandler = require("express-async-handler");
const Menu = require("../models/menuModel");
const { encrypt } = require("../config/EncryptionDecryption");
const logoHandler = require("../config/LogoUpload");
const parseJson = require("../helper/JsonHelper");

const createMenu = asyncHandler(async (req, res) => {
  logoHandler(req, res, async (err) => {
    try {
      const confiq = parseJson(req.body);
      console.log(confiq);

      const { mName, mLocationPath, mIcon, mOrg, mService } = confiq;

      if (!mName || !mLocationPath || !mIcon || !mOrg) {
        res.status(400).json({
          data: {},
          message: "All fields are mandatory",
          isSuccess: false,
        });
        throw new Error("All fields are mandatory");
      }
      const menuData = await Menu.findOne({
        mName: mName,
        mLocationPath: mLocationPath,
        mOrg: mOrg,
      });

      if (menuData?.mName === mName) {
        return res
          .status(400)
          .json({ msg: "Dublicate MenuName. Pls Change MenuName." });
      }
      if (menuData?.mLocationPath === mLocationPath) {
        return res.status(400).json({
          msg: "Dublicate MenuLocationPath. Pls Change MenuLocationPath.",
        });
      }
      const menuImage = req.files["menuImage"]
        ? req.files["menuImage"][0]
        : null;
      console.log(menuImage);

      await Menu.create({
        mName,
        mLocationPath,
        mIcon,
        mOrg,
        mService,
        mImage: menuImage?.filename,
      });
      const menuList = await Menu.find({ mOrg: mOrg });
      const jsonString = JSON.stringify(menuList);
      const encryptedData = encrypt(jsonString);
      res.status(201).json({
        data: encryptedData,
        message: "Create Menu Successfully!.",
        isSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: {},
        message: "Error creating menu",
        isSuccess: false,
      });
    }
  });
});

const getAllMenu = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const menu = await Menu.find({ mOrg: orgId });
  const jsonString = JSON.stringify(menu);
  const encryptedData = encrypt(jsonString);
  res.status(201).json({
    data: encryptedData,
    message: "Get All Menu Successfully!.",
    isSuccess: true,
  });
  // res.status(200).json(user);
});

module.exports = { createMenu, getAllMenu };
