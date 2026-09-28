const express = require("express");
const router = express.Router();

const tutorSearchController = require("../controllers/tutor-search.controller");
const validate = require("../middlewares/validate.middleware");
const asyncHandler = require("../middlewares/async-handler.middleware");
const { tutorSearchSchema } = require("../schemas/tutor-search.schema");

// Import sub-route files
const tutorProfileRoutes = require("./tutor-profile.route");
const tutorSubjectRoutes = require("./tutor-subject.route");
const tutorAvailabilityRoutes = require("./totur-avail.route");


// Resolves to: /tutors/profile
router.use("/profile", tutorProfileRoutes);

// Resolves to: /tutors/subjects
router.use("/subjects", tutorSubjectRoutes);

// Resolves to: /tutors/availability
router.use("/availability", tutorAvailabilityRoutes);

// Resolves to: GET /tutors
router.get(
  "/",
  validate(tutorSearchSchema, "query"),
  asyncHandler(tutorSearchController.searchTutors)
);

// Resolves to: GET /tutors/:tutor_profile_id/availability
router.get(
  "/:tutor_profile_id/availability",
  asyncHandler(tutorSearchController.getTutorAvailabilityByTutor)
);

// Resolves to: GET /tutors/:tutor_profile_id
router.get(
  "/:tutor_profile_id",
  asyncHandler(tutorSearchController.getTutorById)
);

module.exports = router;