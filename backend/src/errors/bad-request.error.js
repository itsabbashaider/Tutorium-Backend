const AppError = require('./app.error');
const STATUS_CODES = require('../constants/status-codes.constant');

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, STATUS_CODES.BAD_REQUEST);
  }
}

module.exports = BadRequestError;