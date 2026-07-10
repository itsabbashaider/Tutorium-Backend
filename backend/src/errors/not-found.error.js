const AppError = require('./app.error');
const STATUS_CODES = require('../constants/status-codes.constant')

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, STATUS_CODES.NOT_FOUND);
  }
}

module.exports = NotFoundError;