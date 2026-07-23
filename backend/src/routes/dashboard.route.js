const express = require("express");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");



const dashboardController = require("../controllers/dashboard.controller");

const USER_ROLES = require("../constants/user-roles.constant");



const router = express.Router();

router.get(
  "/student/me",
  authenticate,
  authorize(USER_ROLES.STUDENT),
  dashboardController.getMyStudentDashboard
);

router.get(
  "/student/:student_profile_id",
  dashboardController.getStudentDashboard
);

router.get(
  "/tutor/me",
  authenticate,
  authorize(USER_ROLES.TUTOR),
  dashboardController.getMyTutorDashboard
);

router.get(
  "/tutor/:tutor_profile_id",
  dashboardController.getTutorDashboard
);

module.exports = router;