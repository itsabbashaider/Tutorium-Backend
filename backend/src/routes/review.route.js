const express = require('express');

const reviewController = require('../controllers/review.controller');

const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  createReviewSchema,
} = require("../schemas/review.schema");

const router = express.Router();

router.use(authenticate);

router.post(
  "/bookings/:booking_id",
  authorize("STUDENT"),
  validate(createReviewSchema),
  reviewController.createReview
);

router.get(
  "/",
  authorize("TUTOR"),
  reviewController.getReviews
);

router.get(
  "/:review_id",
  reviewController.getReviewById
);


module.exports = router;