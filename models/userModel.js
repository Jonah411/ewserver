const mongoose = require("mongoose");

const userTimeouts = {};

const userSchema = mongoose.Schema(
  {
    Organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    userId: {
      type: String,
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
      type: String,
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
    userImage: {
      type: String,
    },
    userAddress: {
      type: String,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    Roll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roll",
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.post("save", function (doc) {
  // If email is not verified, start a deletion timeout
  if (!doc.isEmailVerified) {
    userTimeouts[doc._id] = setTimeout(async () => {
      try {
        const user = await mongoose.model("User").findById(doc._id);
        if (!user.isEmailVerified) {
          await mongoose.model("User").deleteOne({ _id: doc._id });
          console.log(
            `User ${doc._id} deleted after 60 seconds due to unverified email.`
          );
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }, 60000); // 60 seconds
  }
});

// Pre-save hook to check if email is verified and clear timeout if so
userSchema.pre("save", function (next) {
  if (this.isEmailVerified && userTimeouts[this._id]) {
    clearTimeout(userTimeouts[this._id]); // Cancel deletion
    delete userTimeouts[this._id]; // Remove from the timeout store
    console.log(`User ${this._id} email verified. Deletion canceled.`);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
