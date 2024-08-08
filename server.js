const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
connectDb();
const path = require("path");

const app = express();

const cors = require("cors");
const corsOptions = require("./config/CorsOptions");
const authMiddleware = require("./middleware/authMiddleware");
app.use(cors(corsOptions));

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/app/image", express.static(path.join(__dirname, "public/logo")));

app.use("/app/user/", require("./routes/userRoutes"));
app.use("/app/auth", require("./routes/authRoutes"));
app.use("/app/roll", require("./routes/rollRoutes"));
app.use("/app/org/", require("./routes/orgRoutes"));
app.use(errorHandler);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
