const reviewService = require('../services/review.service');
const STATUS_CODES = require('../constants/status-codes.constant');
const asyncHandler = require('../middlewares/async-handler.middleware');

const createReview = asyncHandler(
  async (req, res) => {
    const review = await reviewService.createReview(
      req.user.user_id,
      req.params.booking_id,
      req.body
    );

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Review created successfully.',
      data: review,
    });
  }
);

const getReviews = asyncHandler(
  async (req, res) => {
    const reviews = await reviewService.getMyReviews(
      req.user.user_id
    );

    return res.json({
      success: true,
      data: reviews,
    });
  }
);

const getReviewById = asyncHandler(
  async (req, res) => {
    const review = await reviewService.getReviewById(
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

const reviewService = require('../services/review.service');
const STATUS_CODES = require('../constants/status-codes.constant');
const asyncHandler = require('../middlewares/async-handler.middleware');

const createReview = asyncHandler(
  async (req, res) => {
    const review = await reviewService.createReview(
      req.user.user_id,
      req.params.booking_id,
      req.body
    );

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Review created successfully.',
      data: review,
    });
  }
);

const getReviews = asyncHandler(
  async (req, res) => {
    const reviews = await reviewService.getMyReviews(
      req.user.user_id
    );

    return res.json({
      success: true,
      data: reviews,
    });
  }
);

const getReviewsById = asyncHandler(
  async (req, res) => {
    const review = await reviewService.getReviewById(
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

module.exports = {
  createReview,
  getReviews,
  getReviewById,
};