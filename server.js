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
app.use("/app/components/", require("./routes/componentsRoutes"));
app.use(errorHandler);

app.use("/app/auth/org", authMiddleware, require("./routes/authOrgRoutes"));
app.use("/app/auth/user", authMiddleware, require("./routes/userAuthRoutes"));
app.use("/app/auth/menu", authMiddleware, require("./routes/menuRoutes"));
app.use("/app/auth/roll", authMiddleware, require("./routes/rollAuthRoutes"));
app.use("/app/auth/member", authMiddleware, require("./routes/memberRoutes"));
app.use(
  "/app/auth/position",
  authMiddleware,
  require("./routes/positionRoutes")
);
app.use(
  "/app/auth/components",
  authMiddleware,
  require("./routes/componentsAuthRoutes")
);
app.use("/app/auth/orgType", authMiddleware, require("./routes/orgTypeRoutes"));
app.use("/app/otp", require("./routes/commonRoutes"));
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
