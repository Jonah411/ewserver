const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orgtypeSchema = mongoose.Schema(
  {
    tName: {
      type: String,
      required: true,
    },
    tPlace: {
      type: String,
      required: true,
    },
    tYear: {
      type: String,
      required: true,
    },
    tDescription: {
      type: String,
      required: true,
    },
    tStartAge: {
      type: String,
      required: true,
    },
    tEndAge: {
      type: String,
      required: true,
    },
    // rMenu: { type: Array, default: [] },
    tOrg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    tMember: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
      },
    ],

    // tPosition: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Member",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrgType", orgtypeSchema);
