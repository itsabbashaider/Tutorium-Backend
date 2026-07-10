const AppError = require('../errors/app.error');
const STATUS_CODES = require('../constants/statusCodes.constant');

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You are not authorized to perform this action.",
          STATUS_CODES.FORBIDDEN
        )
      );
    }
    next();
  };
};