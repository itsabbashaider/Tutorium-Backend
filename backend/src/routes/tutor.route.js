const express = require("express");
const router = express.Router();

const tutorSearchController = require("../controllers/tutor-search.controller");

const validate = require("../middlewares/validate.middleware");
const asyncHandler = require("../middlewares/async-handler.middleware");

const {
  tutorSearchSchema,
} = require("../schemas/tutor-search.schema");

router.get(
  "/",
  validate(tutorSearchSchema, "query"),
  asyncHandler(tutorSearchController.searchTutors)
);

router.get(
  "/:tutor_profile_id/availability",
  asyncHandler(
    tutorSearchController.getTutorAvailabilityByTutor
  )
);

router.get(
  "/:tutor_profile_id",
  asyncHandler(
    tutorSearchController.getTutorById
  )
);

module.exports = router;