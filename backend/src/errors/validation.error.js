const STATUS_CODES = require("../constants/status-codes.constant");
const AppError = require("./app.error");

class ValidationError extends AppError {
  constructor(message = "Validation failed", details = null) {
    super(message, STATUS_CODES.BAD_REQUEST, details);
  }
}

module.exports = ValidationError;
