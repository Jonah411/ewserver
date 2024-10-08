const mongoose = require("mongoose");

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
    dob: {
      type: Date,
      default: Date.now,
    },
    marraigedate: {
      type: Date,
      default: Date.now,
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
  if (!doc.isEmailVerified) {
    setTimeout(async () => {
      try {
        await mongoose.model("User").deleteOne({ _id: doc._id });
        console.log(
          `User ${doc._id} deleted after 60 seconds due to unverified email.`
        );
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }, 60000); // 60 seconds
  }
});

module.exports = mongoose.model("User", userSchema);
