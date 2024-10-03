const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orgpositionSchema = mongoose.Schema(
  {
    Organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    Position: [
      {
        type: Schema.Types.ObjectId,
        ref: "Position",
      },
    ],
    about: {
      type: String,
    },
    yearPoint: {
      type: String,
    },
  },
  { timestamps: true }
);

const OrgPosition =
  mongoose.models.OrgPosition ||
  mongoose.model("OrgPosition", orgpositionSchema);

module.exports = OrgPosition;
