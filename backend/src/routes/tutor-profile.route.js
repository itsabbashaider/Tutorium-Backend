const express = require("express");

const router = express.Router();

const tutorProfileController = require("../controllers/totur-profile.controller");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");
const asyncHandler = require("../middlewares/async-handler.middleware");

const {
  updateTutorProfileSchema,
} = require("../schemas/tutor-profile.schema");


router.get(
  "/",
  authenticate,
  authorize("TUTOR"),
  asyncHandler(tutorProfileController.getProfile)
);

router.patch(
  "/",
  authenticate,
  authorize("TUTOR"),
  validate(updateTutorProfileSchema),
  asyncHandler(tutorProfileController.updateProfile)
);


module.exports = router;
