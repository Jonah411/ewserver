const mongoose = require("mongoose");

const componentsSchema = mongoose.Schema(
  {
    cName: {
      type: String,
      required: true,
    },
    cLocationPath: {
      type: String,
      required: true,
    },
    cActive: {
      type: Boolean,
      default: true,
    },
    cOrg: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Components", componentsSchema);
