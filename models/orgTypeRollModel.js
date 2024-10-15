const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orgtyperollSchema = mongoose.Schema(
  {
    otrName: {
      type: String,
      required: true,
    },
    otrAccess: {
      type: String,
      required: true,
    },
    Org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    OrgType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrgType",
      required: true,
    },
    Menu: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrgTypeRoll", orgtyperollSchema);
