const express = require("express");

const studentProfileController = require("../controllers/student-profile.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
  updateStudentProfileSchema,
} = require("../schemas/student-profile.schema");

const asyncHandler = require("../middlewares/async-handler.middleware");

const router = express.Router();

// Public student profile
router.get(
  "/:student_profile_id",
  asyncHandler(
    studentProfileController.getStudentPublicProfile
  )
);

// Authenticated student profile
router.use(authenticate);
router.use(authorize("STUDENT"));

router.get(
  "/",
  studentProfileController.getProfile
);

router.patch(
  "/",
  validate(updateStudentProfileSchema),
  studentProfileController.updateProfile
);

module.exports = router;