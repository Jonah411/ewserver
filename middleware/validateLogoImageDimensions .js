const imageDimensionsValidator = (req, file, cb) => {
  // Check if the file is an image
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"));
  }

  // Use 'image-size' library to get image dimensions
  const dimensions = require("image-size")(file.path);
  const { width, height } = dimensions;

  // Check if the image meets the required dimensions
  if (width !== 250 || height !== 100) {
    return cb(new Error("Image dimensions must be 250x100 pixels"));
  }

  // If the image meets all requirements, pass null as the error
  cb(null, true);
};

module.exports = imageDimensionsValidator;
