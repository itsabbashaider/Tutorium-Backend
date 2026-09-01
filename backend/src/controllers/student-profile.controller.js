const STATUS_CODES = require("../constants/status-codes.constant");

const studentProfileService = require("../services/student-profile.service");

const getProfile = async (req, res) => {
  const profile = await studentProfileService.getProfile(
    req.user.user_id
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: profile,
  });
};

const getStudentPublicProfile = async (req, res) => {
  const profile =
    await studentProfileService.getStudentPublicProfile(
      req.params.student_profile_id
    );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: profile,
  });
};

const updateProfile = async (req, res) => {
  const profile =
    await studentProfileService.updateProfile(
      req.user.user_id,
      req.body
    );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Student profile updated successfully.",
    data: profile,
  });
};

module.exports = {
  getProfile,
  getStudentPublicProfile,
  updateProfile,
};