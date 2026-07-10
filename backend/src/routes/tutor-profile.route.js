const express = require("express");

const router = express.Router();

const tutorProfileController = require("../controllers/tutor-profile.controller");
const tutorSearchController = require('../controllers/tutor-search.controller');

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");
const asyncHandler = require("../middlewares/async-handler.middleware");

const {
  updateTutorProfileSchema,
} = require("../schemas/tutor-profile.schema");

router.get(
  "/",
  protect,
  authorize("TUTOR"),
  asyncHandler(tutorProfileController.getProfile)
);

router.patch(
  "/",
  protect,
  authorize("TUTOR"),
  validate(updateTutorProfileSchema),
  asyncHandler(tutorProfileController.updateProfile)
);

router.get(
  "/",
  validate(tutorSearchSchema, "query"),
  asyncHandler(tutorSearchController.searchTutors)
);

module.exports = router;
