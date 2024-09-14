const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const fs = require("fs");

app.use(express.static("./public"));
app.use(express.static("./public/logo"));

//use of multer package
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create directory if it doesn't exist
    const dir = "./public/logo";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    // If the file is an image, pass null as the error
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

const uploadHandler = upload.fields([
  { name: "orgLogo", maxCount: 1 },
  { name: "userImage", maxCount: 1 },
  { name: "memberImage", maxCount: 1 },
]);

module.exports = uploadHandler;
