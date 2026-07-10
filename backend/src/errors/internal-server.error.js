const STATUS_CODES = require('../constants/status-codes.constant');
const AppError = require('./app.error');

class InternalServerError extends AppError {
  constructor(message = 'Something went wrong') {
    super(message, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = InternalServerError;