const mongoose = require("mongoose");
const {
  createDefaultComponents,
} = require("../middleware/organizationMiddleware");

const orgSchema = mongoose.Schema(
  {
    orgName: {
      type: String,
      required: true,
    },
    orgDisplayName: {
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
      // required: true,
    },
    orgYear: {
      type: Number,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
    },
    orgType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrgType",
      },
    ],
  },
  { timestamps: true }
);

orgSchema.post("save", createDefaultComponents);

module.exports = mongoose.model("Organization", orgSchema);
