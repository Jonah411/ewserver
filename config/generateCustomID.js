const memberModel = require("../models/memberModel");
const orgModel = require("../models/orgModel");
const Position = require("../models/positionModel");
const userModel = require("../models/userModel");

const generateOrgCustomID = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const lastUser = await orgModel
    .findOne({
      orgId: { $regex: `^O${year}${month}${day}` },
    })
    .sort({ createdAt: -1 });

  let number = 1;
  if (lastUser) {
    const lastID = lastUser.orgId;
    number = parseInt(lastID?.slice(-4)) + 1;
  }

  return `O${year}${month}${day}${String(number).padStart(4, "0")}`;
};
const generateUserCustomID = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const lastUser = await userModel
    .findOne({
      userId: { $regex: `^U${year}${month}${day}` },
    })
    .sort({ createdAt: -1 });

  let number = 1;
  if (lastUser) {
    const lastID = lastUser.userId;
    number = parseInt(lastID?.slice(-4)) + 1;
  }

  return `U${year}${month}${day}${String(number).padStart(4, "0")}`;
};
const generateMemberCustomID = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const lastUser = await memberModel
    .findOne({
      memberId: { $regex: `^M${year}${month}${day}` },
    })
    .sort({ createdAt: -1 });

  let number = 1;
  if (lastUser) {
    const lastID = lastUser.memberId;
    number = parseInt(lastID?.slice(-4)) + 1;
  }

  return `M${year}${month}${day}${String(number).padStart(4, "0")}`;
};

const generatePositionCustomID = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const lastUser = await Position.findOne({
    positionId: { $regex: `^P${year}${month}${day}` },
  }).sort({ createdAt: -1 });

  let number = 1;
  if (lastUser) {
    const lastID = lastUser.positionId;
    number = parseInt(lastID?.slice(-4)) + 1;
  }

  return `P${year}${month}${day}${String(number).padStart(4, "0")}`;
};

module.exports = {
  generateOrgCustomID,
  generateMemberCustomID,
  generateUserCustomID,
  generatePositionCustomID,
};
