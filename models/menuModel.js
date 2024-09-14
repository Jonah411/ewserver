const mongoose = require("mongoose");

const menuSchema = mongoose.Schema(
  {
    mName: {
      type: String,
      required: true,
    },
    mLocationPath: {
      type: String,
      required: true,
    },
    mIcon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);