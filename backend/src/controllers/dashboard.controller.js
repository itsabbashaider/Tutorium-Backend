const dashboardService = require("../services/dashboard.service");

const STATUS_CODES = require("../constants/status-codes.constant");

const asyncHandler = require("../middlewares/async-handler.middleware");


const getMyStudentDashboard = asyncHandler (
  async (req, res) => {
    const dashboard = 
      await dashboardService.getMyStudentDashboard(
        req.user.user_id
      );
    
    return res
      .status(STATUS_CODES.OK)
      .json({
        success: true,
        data: dashboard,
      });
  }
);

const getStudentDashboard = asyncHandler (
  async (req, res) => {
    const dashboard = 
      await dashboardService.getStudentDashboard(
        req.params.student_profile_id
      );

    return res
      .status(STATUS_CODES.OK)
      .json({
        success: true,
        data: dashboard,
      });
  }
);

const getMyTutorDashboard = asyncHandler (
  async (req, res) => {
    const dashboard = 
      await dashboardService.getMyTutorDashboard(
        req.user.user_id
      );

    return res
      .status(STATUS_CODES.OK)
      .json({
        success: true,
        data: dashboard,
      });
  }
);

const getTutorDashboard = asyncHandler (
  async (req, res) => {
    const dashboard =
      await dashboardService.getTutorDashboard(
        req.params.tutor_profile_id
      );
    
    return res
      .status(STATUS_CODES.OK)
      .json({
        success: true,
        data: dashboard,
      });
  }
);

module.exports = {
  getMyStudentDashboard,
  getStudentDashboard,

  getMyTutorDashboard,
  getTutorDashboard
};