const { Booking, Review } = require("../models");

const { NotFoundError } = require("../errors/app.error");
const { ForbiddenError } = require("../errors/app.error");

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
  return await Review.findAndCountAll({
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
    distinct: true,
    ...options,
  });
};

const verifyBookingReviewOwner = (
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

const verifyTutorReviewOwner = (
  review,
  tutorProfile
) => {
  if (
    review.booking.tutor_profile_id !==
    tutorProfile.tutor_profile_id
  ) {
    throw new ForbiddenError(
      "You do not have permission to access this review."
    );
  }
};

module.exports = {
  reviewInclude,

  formatReview,
  formatReviewList,

  findReview,
  findReviewByBooking,
  getTutorReviews,

  verifyBookingReviewOwner,
  verifyTutorReviewOwner,
  canReviewBooking,
};