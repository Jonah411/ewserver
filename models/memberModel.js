const mongoose = require("mongoose");
const { incrementMemberCount } = require("../middleware/memberMiddleware");

const memberSchema = mongoose.Schema(
  {
    Organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    memberImage: {
      type: String,
    },
    userAddress: {
      type: String,
    },
    memberId: {
      type: String,
      required: true,
    },
    Roll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roll",
      required: true,
    },
  },
  { timestamps: true }
);
memberSchema.post("save", incrementMemberCount);

module.exports = mongoose.model("Member", memberSchema);
