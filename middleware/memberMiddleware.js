const userModel = require("../models/userModel");

const incrementMemberCount = async function (doc, next) {
  try {
    await userModel.findByIdAndUpdate(doc.User, { $inc: { memberCount: 1 } });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { incrementMemberCount };
