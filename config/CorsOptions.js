const allowedOrigins = [
  "http://localhost:3000/",
  "http://localhost:3000",
  "http://localhost:3001/",
  "http://localhost:3001",
  "https://ewserver.onrender.com",
  "https://ewserver.onrender.com/",
  "https://easyproduct.netlify.app/",
  "https://easyproduct.netlify.app",
  "https://easyproduct.onrender.com/",
  "https://easyproduct.onrender.com",
  "https://orgtypeworkeasy.netlify.app/",
  "https://orgtypeworkeasy.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
