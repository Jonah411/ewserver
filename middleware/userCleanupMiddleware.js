const mongoose = require("mongoose");
const userModel = require("../models/userModel");

const userCleanupMiddleware = async (req, res, next) => {
  // Proceed to the next middleware or route handler
  next();

  const { userId } = req.body; // Assuming you're getting userId from the request body
  const user = await userModel.findById(userId);

  if (user && !user.isEmailVerified) {
    setTimeout(async () => {
      try {
        await userModel.deleteOne({ _id: user._id });
        console.log(
          `User ${user._id} deleted after 60 seconds due to unverified email.`
        );
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }, 60000); // 60 seconds
  }
};

module.exports = userCleanupMiddleware;
