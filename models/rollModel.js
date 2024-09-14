const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    rMenu: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roll", rollSchema);
