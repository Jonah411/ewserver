const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const getAllOrganizationUser = asyncHandler(async (req, res) => {
  const user = await User.find({ Organization: req.params.id }).populate(
    "Organization"
  );
  console.log(user);

  res.status(200).json({
    msg: "Get all organization Successfully!",
    status: true,
    data: user,
  });
});

module.exports = {
  getAllOrganizationUser,
};
