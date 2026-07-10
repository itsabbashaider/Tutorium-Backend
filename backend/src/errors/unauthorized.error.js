const AppError = require('./app.error');
const STATUS_CODES = require('../constants/status-codes.constant')

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, STATUS_CODES.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;