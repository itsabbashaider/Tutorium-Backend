const STATUS_CODES = require("../constants/status-codes.constant");
const onboardingService = require("../services/role-selection.service");
const asyncHandler = require("../middlewares/async-handler.middleware");
const { getCookieOptions } = require("../utils/cookie.util");

const selectRole = asyncHandler(async (req, res) => {
  const { role } = req.body; // "STUDENT" or "TUTOR"
  const user_id = req.user.user_id; // Supplied by authenticate middleware

  const { token, user } = await onboardingService.updateRole(user_id, role);

  res.cookie("token", token, getCookieOptions());

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Role selected successfully.",
    data: user,
  });
});

module.exports = {
  selectRole,
};