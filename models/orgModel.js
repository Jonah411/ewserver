const mongoose = require("mongoose");

const orgSchema = mongoose.Schema(
  {
    orgName: {
      type: String,
      required: true,
    },
    orgPlace: {
      type: String,
      required: true,
    },
    orgAddress: {
      type: String,
      required: true,
    },
    orgMembersCount: {
      type: Number,
      required: true,
    },
    orgLogo: {
      type: String,
    },
    orgDescription: {
      type: String,
      required: true,
    },
    orgYear: {
      type: Number,
      required: true,
    },
    orgMebAgeFrom: {
      type: Number,
      required: true,
    },
    orgMebAgeTo: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", orgSchema);
