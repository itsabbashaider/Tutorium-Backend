const STATUS_CODES = require("../constants/status-codes.constant");

const authService = require("../services/auth.service");

const asyncHandler = require("../middlewares/async-handler.middleware");

const { getCookieOptions } = require("../utils/cookie.util");

const register = asyncHandler(async (req, res) => {
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

const googleRedirect = asyncHandler(async (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return res.redirect(`${rootUrl}?${qs.toString()}`);
});

const googleCallback = asyncHandler(async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ success: false, message: "Authorization code not provided." });
  }

  const { token, user, isNewUser } = await authService.googleAuth(code);

  res.cookie("token", token, getCookieOptions());

  return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
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
  googleRedirect,
  googleCallback,
  logout,
  getMe,
};
