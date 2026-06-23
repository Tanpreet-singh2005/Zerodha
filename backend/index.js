const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const { PositionsModel } = require("./model/PositionsModel");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const holdingsRoute = require("./Routes/HoldingsRoute");
const ordersRoute = require("./Routes/OrdersRoute");
const fundsRoute = require("./Routes/FundsRoute");

const app = express();
const cors = require("cors");

// Build allowed origins from env vars + localhost defaults
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

app.use(cookieParser());
app.use(express.json());

app.use("/", authRoute);
app.use("/api", holdingsRoute);
app.use("/api", ordersRoute);
app.use("/api", fundsRoute);

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});