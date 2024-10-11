const mongoose = require("mongoose");
const { incrementMemberCount } = require("../middleware/memberMiddleware");

const memberTimeouts = {};

const memberSchema = mongoose.Schema(
  {
    Organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    orgtype: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrgType",
      },
    ],
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    marraigestatus: {
      type: Number,
      default: "Single",
    },
    dob: {
      type: Date,
    },
    marraigedate: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationEmailCode: String,
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    memberImage: {
      type: String,
    },
    userAddress: {
      type: String,
    },
    memberId: {
      type: String,
      required: true,
    },
    Roll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roll",
      required: true,
    },
    orgtypeRoll: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrgTypeRoll",
      },
    ],
  },
  { timestamps: true }
);
memberSchema.post("save", incrementMemberCount);

memberSchema.post("save", function (doc) {
  // If email is not verified, start a deletion timeout
  if (!doc.isEmailVerified) {
    memberTimeouts[doc._id] = setTimeout(async () => {
      try {
        const user = await mongoose.model("Member").findById(doc._id);
        if (!user.isEmailVerified) {
          await mongoose.model("Member").deleteOne({ _id: doc._id });
          console.log(
            `Member ${doc._id} deleted after 60 seconds due to unverified email.`
          );
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }, 60000); // 60 seconds
  }
});

// Pre-save hook to check if email is verified and clear timeout if so
memberSchema.pre("save", function (next) {
  if (this.isEmailVerified && memberTimeouts[this._id]) {
    clearTimeout(memberTimeouts[this._id]); // Cancel deletion
    delete memberTimeouts[this._id]; // Remove from the timeout store
    console.log(`Member ${this._id} email verified. Deletion canceled.`);
  }
  next();
});

module.exports = mongoose.model("Member", memberSchema);
