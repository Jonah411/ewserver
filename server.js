const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/app/user", require("./routes/userRoutes"));
//app.use("/app/auth", require("./routes/authRoutes"));
app.use("/app/roll", require("./routes/rollRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
