const mongoose = require("mongoose");
const {
  createDefaultOrgPosition,
} = require("../middleware/positionMiddleware");
const Schema = mongoose.Schema;

const positionSchema = new Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pCount: {
      type: Number,
      required: true,
    },
    positionId: {
      type: String,
      required: true,
    },
    Organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    pMember: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
  },
  { timestamps: true }
);

positionSchema.post("save", createDefaultOrgPosition);

const Position =
  mongoose.models.Position || mongoose.model("Position", positionSchema);

module.exports = Position;
