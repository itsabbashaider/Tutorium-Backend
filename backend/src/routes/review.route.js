const express = require('express');

const reviewController = require('../controllers/review.controller');

const { 
  authenticate,
  authorize,
 } = require('../middlewares/auth.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  createReviewSchema,
} = require("../schemas/review.schema");

const router = express.Router();

router.use(authenticate);

// Student
router.post(
  "/",
  authorize("STUDENT"),
  validate(createReviewSchema),
  reviewController.createReview
);

// Tutor
router.get(
  "/my",
  authorize("TUTOR"),
  reviewController.getMyReviews
);

// Public / Shared
router.get(
  "/tutor/:tutor_profile_id",
  reviewController.getTutorReviews
);

router.get(
  "/:review_id",
  reviewController.getReviewById
);


module.exports = router;