const { Review } = require("../models");

const { BadRequestError } = require("../errors/app.error");

const {
  getPagination,
  getPaginationMeta,
} = require("../utils/pagination.util");

const {
  findStudentProfile,
} = require("../utils/student-profile.util");

const {
  findTutorProfileById,
  findTutorProfile,
  updateTutorRatingStats,
} = require("../utils/tutor-profile.util");

const {
  findBooking,
} = require("../utils/booking.util");

const {
  reviewInclude,

  formatReview,
  formatReviewList,

  findReview,
  findReviewByBooking,
  getTutorReviews: getTutorReviewsFromDB,

  verifyBookingReviewOwner,
  verifyTutorReviewOwner,
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

  verifyBookingReviewOwner(
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
    await findTutorProfileById(
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
  user_id,
  query
) => {
  const tutorProfile =
    await findTutorProfile(user_id);
    

  const { page, limit, offset } =
    getPagination(
      query.page,
      query.limit
    );

  const { count, rows } =
    await getTutorReviewsFromDB(
      tutorProfile.tutor_profile_id,
      {
        include: reviewInclude,
        limit,
        offset,
      }
    );

  return {
    reviews: formatReviewList(rows),
    pagination: getPaginationMeta(
      count,
      page,
      limit
    ),
  };
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

    verifyBookingReviewOwner(
      review.booking,
      studentProfile
    );
  } else {
    const tutorProfile =
      await findTutorProfile(user_id);

    verifyTutorReviewOwner(
      review,
      tutorProfile
    );
  }

  return formatReview(review);
};

const getTutorReviews = async (
  tutor_profile_id,
  query
) => {
  const { page, limit, offset } =
    getPagination(query.page, query.limit);

  const { count, rows } =
    await getTutorReviewsFromDB(
      tutor_profile_id,
      {
        include: reviewInclude,
        limit,
        offset,
      }
    );


  return {
    reviews: formatReviewList(rows),
    pagination: getPaginationMeta(
      count,
      page,
      limit
    ),
  };
};

module.exports = {
  createReview,

  getMyReviews,
  getTutorReviews,
  getReviewById,
};