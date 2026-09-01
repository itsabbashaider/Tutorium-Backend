const express = require("express");

const reviewController = require("../controllers/review.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
  createReviewSchema,
} = require("../schemas/review.schema");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/
router.get(
  "/tutor/:tutor_profile_id",
  reviewController.getTutorReviews
);

/*
|--------------------------------------------------------------------------
| Student
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  authenticate,
  authorize("STUDENT"),
  validate(createReviewSchema),
  reviewController.createReview
);

/*
|--------------------------------------------------------------------------
| Tutor
|--------------------------------------------------------------------------
*/
router.get(
  "/my",
  authenticate,
  authorize("STUDENT", "TUTOR"),
  reviewController.getMyReviews
);


/*
|--------------------------------------------------------------------------
| Shared authenticated route
|--------------------------------------------------------------------------
*/
router.get(
  "/:review_id",
  authenticate,
  authorize("STUDENT", "TUTOR"),
  reviewController.getReviewById
);

module.exports = router;
