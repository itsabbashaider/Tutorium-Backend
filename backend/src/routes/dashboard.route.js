const express = require("express");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

const dashboardController = require("../controllers/dashboard.controller");

const USER_ROLES = require("../constants/user-roles.constant");

const asyncHandler = require("../middlewares/async-handler.middleware");

const router = express.Router();

router.get(
  "/student/me",
  authenticate,
  authorize(USER_ROLES.STUDENT),
  asyncHandler(dashboardController.getMyStudentDashboard)
);

router.get(
  "/student/:student_profile_id",
  asyncHandler(dashboardController.getStudentDashboard)
);

router.get(
  "/tutor/me",
  authenticate,
  authorize(USER_ROLES.TUTOR),
  asyncHandler(dashboardController.getMyTutorDashboard)
);

router.get(
  "/tutor/:tutor_profile_id",
  asyncHandler(dashboardController.getTutorDashboard)
);

module.exports = router;