const STATUS_CODES = require("../constants/status-codes.constant");

const authService = require("../services/auth.service");

const asyncHandler = require("../middlewares/async-handler.middleware");

const { getCookieOptions } = require("../utils/cookie.util");

const register = asyncHandler(async (req, res) => {
  console.log(req.body);
  
  const user = await authService.register(req.body);

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "User registered successfully.",
    data: user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);

  res.cookie("token", token, getCookieOptions());

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Login successful.",
    data: user,
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout();

  res.clearCookie("token", getCookieOptions());

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Logout successful.",
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.user_id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: user,
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};