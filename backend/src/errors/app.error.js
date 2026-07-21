const STATUS_CODES = require('../constants/status-codes.constant');

class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);

    this.name           = this.constructor.name;
    this.statusCode     = statusCode;
    this.status         = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.details        = details;
    this.isOperational  = true;

    Error.captureStackTrace(this, this.constructor);
  }
}


class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details = null) {
    super(
      message,
      STATUS_CODES.BAD_REQUEST,
      details
    );
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict occurred', details = null) {
    super(
      message,
      STATUS_CODES.CONFLICT,
      details
    );
  }
}


class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details = null) {
    super(
      message,
      STATUS_CODES.FORBIDDEN,
      details
    );
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Something went wrong', details = null) {
    super(
      message,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      details
    );
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details = null) {
    super(
      message,
      STATUS_CODES.NOT_FOUND,
      details
    );
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details = null) {
    super(
      message,
      STATUS_CODES.UNAUTHORIZED,
      details
    );
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed", details = null) {
    super(
      message,
      STATUS_CODES.BAD_REQUEST,
      details
    );
  }
}
module.exports = {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
};