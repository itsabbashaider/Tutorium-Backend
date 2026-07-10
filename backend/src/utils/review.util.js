const { Booking, Review } = require("../models");

const NotFoundError = require("../errors/not-found.error");
const ForbiddenError = require("../errors/forbidden.error");

const reviewInclude = [
  {
    model: Booking,
    as: "booking",
  },
];

const formatReview = (review) => ({
  review_id: review.review_id,

  booking_id: review.booking_id,

  rating: review.rating,
  comment: review.comment,

  created_at: review.created_at,
  updated_at: review.updated_at,
});

const formatReviewList = (reviews) => {
  return reviews.map(formatReview);
};

const findReview = async (
  review_id,
  options = {}
) => {
  const review = await Review.findByPk(
    review_id,
    options
  );

  if (!review) {
    throw new NotFoundError(
      "Review not found."
    );
  }

  return review;
};

const findReviewByBooking = async (
  booking_id,
  options = {}
) => {
  return await Review.findOne({
    where: {
      booking_id,
    },
    ...options,
  });
};

const getTutorReviews = async (
  tutor_profile_id,
  options = {}
) => {
  return await Review.findAll({
    include: [
      {
        model: Booking,
        as: "booking",
        where: {
          tutor_profile_id,
        },
      },
    ],
    order: [
      ["created_at", "DESC"],
    ],
    ...options,
  });
};

const verifyReviewOwner = (
  booking,
  studentProfile
) => {
  if (
    booking.student_profile_id !==
    studentProfile.student_profile_id
  ) {
    throw new ForbiddenError(
      "You do not have permission to review this booking."
    );
  }
};

const canReviewBooking = (
  booking,
  existingReview
) => {
  return (
    booking.status === "COMPLETED" &&
    !existingReview
  );
};

module.exports = {
  reviewInclude,

  formatReview,
  formatReviewList,

  findReview,
  findReviewByBooking,
  getTutorReviews,

  verifyReviewOwner,
  canReviewBooking,
};