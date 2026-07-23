const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const STATUS_CODES = require('./constants/status-codes.constant')
const env = require("./config/env"); 

const router = require("./routes");
const errorHandler = require("./middlewares/error-handler.middleware");

const app = express();

app.use(
  cors({
    origin: env.app.frontendUrl, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Tutorium API is running.",
  });
});

app.use("/api", router);

app.use(errorHandler);

app.listen(env.app.port, () => {
  console.log(
    `🚀 Tutorium API is running in ${env.app.nodeEnv} mode on http://localhost:${env.app.port}`
  );
});

