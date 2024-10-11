const userModel = require("../models/userModel");

const incrementMemberCount = async function (doc, next) {
  try {
    await userModel.findByIdAndUpdate(
      doc.User,
      {
        $inc: { memberCount: 1 }, // Increment memberCount
        $set: {
          // Set other non-numeric fields
          isEmailVerified: true,
          verificationEmailCode: "",
        },
      },
      { new: true } // Return the updated document
    );
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { incrementMemberCount };
