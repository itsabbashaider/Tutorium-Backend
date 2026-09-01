const {
  Booking,
  Review,
  StudentProfile,
  TutorProfile,
  User,
  Subject,
} = require("../models");

const { NotFoundError } = require("../errors/app.error");
const { ForbiddenError } = require("../errors/app.error");

const reviewInclude = [
  {
    model: Booking,
    as: "booking",

    include: [
      {
        model: StudentProfile,
        as: "student",
        attributes: ["student_profile_id"],

        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "full_name"],
          },
        ],
      },

      {
        model: TutorProfile,
        as: "tutor",
        attributes: ["tutor_profile_id"],

        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "full_name"],
          },
        ],
      },

      {
        model: Subject,
        as: "subject",
        attributes: [
          "subject_id",
          "subject_name",
        ],
      },
    ],
  },
];

const formatReview = (review) => ({
  review_id: review.review_id,

  rating: review.rating,
  comment: review.comment,

  created_at: review.created_at,
  updated_at: review.updated_at,

  booking: review.booking
    ? {
        booking_id:
          review.booking.booking_id,

        booking_date:
          review.booking.booking_date,

        booking_start:
          review.booking.booking_start,

        booking_end:
          review.booking.booking_end,

        status:
          review.booking.status,

        student: review.booking.student
          ? {
              student_profile_id:
                review.booking.student
                  .student_profile_id,

              full_name:
                review.booking.student.user
                  ?.full_name || "Student",
            }
          : null,

        tutor: review.booking.tutor
          ? {
              tutor_profile_id:
                review.booking.tutor
                  .tutor_profile_id,

              full_name:
                review.booking.tutor.user
                  ?.full_name || "Tutor",
            }
          : null,

        subject: review.booking.subject
          ? {
              subject_id:
                review.booking.subject
                  .subject_id,

              subject_name:
                review.booking.subject
                  .subject_name,
            }
          : null,
      }
    : null,
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
    ...options,

    include: [
      {
        ...reviewInclude[0],

        where: {
          tutor_profile_id,
        },
      },
    ],

    order: [
      ["created_at", "DESC"],
    ],

    distinct: true,
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