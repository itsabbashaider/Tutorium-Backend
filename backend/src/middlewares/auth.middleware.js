const jwt = require("jsonwebtoken");

const { User } = require("../models");
const config = require("../config/env");

const { AppError } = require("../errors/app.error");
const STATUS_CODES = require("../constants/status-codes.constant");

const asyncHandler = require("./async-handler.middleware");

const authenticate = asyncHandler(async (req, res, next) => {
  console.log("Cookies:", req.cookies);

  const token = req.cookies.token;

  if (!token) {
    return next(
      new AppError(
        "Please login first.",
        STATUS_CODES.UNAUTHORIZED
      )
    );
  }

  const decoded = jwt.verify(token, config.jwt.secret);

  const user = await User.findByPk(decoded.user_id);

  if (!user) {
    return next(
      new AppError(
        "User no longer exists.",
        STATUS_CODES.UNAUTHORIZED
      )
    );
  }

  req.user = user;

  next();
});

const authorize = (...roles) => {
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

module.exports = {
  authenticate,
  authorize,
};