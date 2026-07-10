const { Review } = require("../models");

const BadRequestError = require("../errors/bad-request.error");

const {
  findStudentProfile,
} = require("../utils/student-profile.util");

const {
  findTutorProfile,
  updateTutorRatingStats,
} = require("../utils/tutor-profile.util");

const {
  findBooking,
  verifyTutorBookingOwner,
} = require("../utils/booking.util");

const {
  reviewInclude,

  formatReview,
  formatReviewList,

  findReview,
  findReviewByBooking,
  getTutorReviews,

  verifyReviewOwner,
  canReviewBooking,
} = require("../utils/review.util");

const createReview = async (
  user_id,
  booking_id,
  data
) => {
  const studentProfile =
    await findStudentProfile(user_id);

  const booking = await findBooking(
    booking_id
  );

  verifyReviewOwner(
    booking,
    studentProfile
  );

  const existingReview =
    await findReviewByBooking(
      booking.booking_id
    );

  if (
    !canReviewBooking(
      booking,
      existingReview
    )
  ) {
    throw new BadRequestError(
      "This booking cannot be reviewed."
    );
  }

  const review = await Review.create({
    booking_id: booking.booking_id,
    rating: data.rating,
    comment: data.comment,
  });

  const tutorProfile =
    await findTutorProfile(
      booking.tutor_profile_id
    );

  await updateTutorRatingStats(
    tutorProfile
  );

  const createdReview =
    await findReview(
      review.review_id,
      {
        include: reviewInclude,
      }
    );

  return formatReview(createdReview);
};

const getMyReviews = async (
  user_id
) => {
  const tutorProfile =
    await findTutorProfile(user_id);

  const reviews =
    await getTutorReviews(
      tutorProfile.tutor_profile_id,
      {
        include: reviewInclude,
      }
    );

  return formatReviewList(reviews);
};

const getReviewById = async (
  user_id,
  role,
  review_id
) => {
  const review = await findReview(
    review_id,
    {
      include: reviewInclude,
    }
  );

  if (role === "STUDENT") {
    const studentProfile =
      await findStudentProfile(user_id);

    verifyReviewOwner(
      review.booking,
      studentProfile
    );
  } else {
    const tutorProfile =
      await findTutorProfile(user_id);

    verifyTutorBookingOwner(
      tutorProfile,
      review.booking
    );
  }

  return formatReview(review);
};

module.exports = {
  createReview,

  getMyReviews,
  getReviewById,
};