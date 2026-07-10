const STATUS_CODES = require("../constants/status-codes.constant");

const tutorProfileService = require("../services/tutor-profile.service");

const getProfile = async (req, res) => {
  const profile = await tutorProfileService.getProfile(
    req.user.user_id
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: profile,
  });
};

const updateProfile = async (req, res) => {
  const profile = await tutorProfileService.updateProfile(
    req.user.user_id,
    req.body
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Tutor profile updated successfully.",
    data: profile,
  });
};

module.exports = {
  getProfile,
  updateProfile,
};