const mongoose = require("mongoose");

const orgtypemenuSchema = mongoose.Schema(
  {
    otmName: {
      type: String,
      required: true,
    },
    otmLocationPath: {
      type: String,
      required: true,
    },
    otmIcon: {
      type: String,
      required: true,
    },
    Org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    OrgType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrgType",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrgTypeMenu", orgtypemenuSchema);
