const reviewService = require("../services/review.service");

const STATUS_CODES = require("../constants/status-codes.constant");

const asyncHandler = require("../middlewares/async-handler.middleware");

const createReview = asyncHandler(
  async (req, res) => {
    const review =
      await reviewService.createReview(
        req.user.user_id,
        req.body.booking_id,
        req.body
      );

    return res
      .status(STATUS_CODES.CREATED)
      .json({
        success: true,
        message:
          "Review created successfully.",
        data: review,
      });
  }
);


const getMyReviews = asyncHandler(
  async (req, res) => {
    const reviews =
      await reviewService.getMyReviews(
        req.user.user_id,
        req.user.role,
        req.query
      );

    return res.json({
      success: true,
      data: reviews,
    });
  }
);

const getReviewById = asyncHandler(
  async (req, res) => {
    const review =
      await reviewService.getReviewById(
        req.user.user_id,
        req.user.role,
        req.params.review_id
      );

    return res.json({
      success: true,
      data: review,
    });
  }
);

const getTutorReviews = asyncHandler(
  async (req, res) => {
    const reviews =
      await reviewService.getTutorReviews(
        req.params.tutor_profile_id,
        req.query
      );

    return res.json({
      success: true,
      data: reviews,
    });
  }
);

module.exports = {
  createReview,

  // Tutor
  getMyReviews,

  // Shared/public
  getTutorReviews,
  getReviewById,
};
