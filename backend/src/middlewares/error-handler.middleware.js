const STATUS_CODES = require("../constants/status-codes.constant");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
