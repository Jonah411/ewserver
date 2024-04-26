const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    authId: {
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
    familyName: {
      type: String,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
    Roll: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
