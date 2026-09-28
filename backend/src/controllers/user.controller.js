const userService = require("../services/user.service");

const AsyncHandler = require("../middlewares/async-handler.middleware");

const STATUS_CODES = require("../constants/status-codes.constant");

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

const updateAvatar = AsyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Please upload an image file.",
    });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  const updatedUser = await userService.updateAvatar(
    req.user.user_id,
    avatarUrl
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Avatar updated successfully.",
    data: {
      avatar_url: updatedUser.avatar_url,
    },
  });
});

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
};