const AppError = require('./app.error');
const STATUS_CODES = require('../constants/status-codes.constant');

class ConflictError extends AppError {
  constructor(message = 'Conflict occurred') {
    super(message, STATUS_CODES.CONFLICT);
  }
}

module.exports = ConflictError;