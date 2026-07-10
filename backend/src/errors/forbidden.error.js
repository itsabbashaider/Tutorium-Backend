const AppError = require('./app.error');
const STATUS_CODES = require('../constants/status-codes.constant');

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, STATUS_CODES.FORBIDDEN);
  }
}

module.exports = ForbiddenError;