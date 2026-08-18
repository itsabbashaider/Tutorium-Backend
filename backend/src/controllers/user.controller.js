const userService = require("../services/user.service");

const AsyncHandler = require("../middlewares/async-handler.middleware");

const  STATUS_CODES  = require("../constants/status-codes.constant");

const getProfile = AsyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.user_id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: user,
  });
});

const updateProfile = AsyncHandler(async (req, res) => {
  const user = await userService.updateProfile(
    req.user.user_id,
    req.body
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Profile updated successfully.",
    data: user,
  });
});

module.exports = {
  getProfile,
  updateProfile,
};