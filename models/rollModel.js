const mongoose = require("mongoose");

const rollSchema = mongoose.Schema(
  {
    rName: {
      type: String,
      required: true,
    },
    fAccess: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roll", rollSchema);
