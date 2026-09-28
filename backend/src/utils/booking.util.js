const { Op } = require("sequelize");

const {
  Booking,
  Review,
  StudentProfile,
  TutorProfile,
  User,
  Subject,
  TutorAvailability,
} = require("../models");

const {
  NotFoundError,
  ForbiddenError,
} = require("../errors/app.error");

const bookingInclude = [
  {
    model: StudentProfile,
    as: "student",

    include: [
      {
        model: User,
        as: "user",

        attributes: [
          "user_id",
          "full_name",
          "city",
          "avatar_url",
        ],
      },
    ],
  },

  {
    model: TutorProfile,
    as: "tutor",

    include: [
      {
        model: User,
        as: "user",

        attributes: [
          "user_id",
          "full_name",
          "city",
          "avatar_url",
        ],
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

  {
    model: TutorAvailability,
    as: "availabilitySlot",
  },

  {
    model: Review,
    as: "review",
    attributes: ["review_id"],
    required: false,
  },
];

const formatBooking = (
  booking,
  role = null
) => ({
  booking_id:
    booking.booking_id,

  booking_date:
    booking.booking_date,

  booking_start:
    booking.booking_start,

  booking_end:
    booking.booking_end,

  booked_hourly_rate:
    Number(
      booking.booked_hourly_rate
    ),

  status:
    booking.status,

  is_completed:
    booking.is_completed,

  meeting_link:
    booking.meeting_link,

  intro_message:
    booking.intro_message,

  cancelled_by:
    booking.cancelled_by,

  cancelled_at:
    booking.cancelled_at,

  rejection_reason:
    booking.rejection_reason,

  review:
    booking.review
      ? {
          review_id:
            booking.review
              .review_id,
        }
      : null,

  available_actions:
    role === "STUDENT"
      ? {
          can_cancel:
            canCancelBooking(
              booking
            ),

          can_review:
            booking.status ===
              "COMPLETED" &&
            !booking.review,
        }
      : role === "TUTOR"
        ? {
            can_accept:
              canAcceptBooking(
                booking
              ),

            can_reject:
              canRejectBooking(
                booking
              ),

            can_complete:
              canCompleteBooking(
                booking
              ),
          }
        : {
            can_cancel: false,
            can_review: false,
            can_accept: false,
            can_reject: false,
            can_complete: false,
          },

  subject:
    booking.subject
      ? {
          subject_id:
            booking.subject
              .subject_id,

          subject_name:
            booking.subject
              .subject_name,
        }
      : null,

  student:
    booking.student
      ? {
          student_profile_id:
            booking.student
              .student_profile_id,

          user: {
            user_id:
              booking.student.user
                .user_id,

            full_name:
              booking.student.user
                .full_name,

            city:
              booking.student.user
                .city,
            avatar_url:
            booking.student.user.avatar_url || null,
          },
        }
      : null,

  tutor:
    booking.tutor
      ? {
          tutor_profile_id:
            booking.tutor
              .tutor_profile_id,

          user: {
            user_id:
              booking.tutor.user
                .user_id,

            full_name:
              booking.tutor.user
                .full_name,

            city:
              booking.tutor.user
                .city,
            avatar_url:
              booking.tutor.user.avatar_url || null,
          },
        }
      : null,

  availability:
    booking.availabilitySlot
      ? {
          availability_slot_id:
            booking.availabilitySlot
              .availability_slot_id,

          day_of_week:
            booking.availabilitySlot
              .day_of_week,

          start_time:
            booking.availabilitySlot
              .start_time,

          end_time:
            booking.availabilitySlot
              .end_time,

          is_active:
            booking.availabilitySlot
              .is_active,
        }
      : null,
});

const formatBookingList = (
  bookings,
  role
) => {
  return bookings.map(
    (booking) =>
      formatBooking(
        booking,
        role
      )
  );
};

const findBooking = async (
  booking_id,
  options = {}
) => {
  const booking = await Booking.findByPk(
    booking_id,
    options
  );

  if (!booking) {
    throw new NotFoundError(
      "Booking not found."
    );
  }

  return booking;
};

const verifyStudentBookingOwner = (
  studentProfile,
  booking
) => {
  if (
    booking.student_profile_id !==
    studentProfile.student_profile_id
  ) {
    throw new ForbiddenError(
      "You do not have permission to access this booking."
    );
  }
};

const verifyTutorBookingOwner = (
  tutorProfile,
  booking
) => {
  if (
    booking.tutor_profile_id !==
    tutorProfile.tutor_profile_id
  ) {
    throw new ForbiddenError(
      "You do not have permission to access this booking."
    );
  }
};

const canBookTutor = (tutorProfile) => {
  return tutorProfile.is_available === true;
};

const canBookAvailability = (
  availability
) => {
  return availability.is_active === true;
};

const canAcceptBooking = (booking) => {
  return booking.status === "PENDING";
};

const canRejectBooking = (booking) => {
  return booking.status === "PENDING";
};

const canCancelBooking = (booking) => {
  return booking.status === "PENDING";
};

const canCompleteBooking = (booking) => {
  return booking.status === "ACCEPTED";
};

const getBookings = async (
  where,
  options = {}
) => {
  return Booking.findAndCountAll({
    where,

    order: [
      ["created_at", "DESC"],
    ],

    ...options,

    distinct: true,
  });
};

const hasBookingConflict = async (
  availability_slot_id,
  booking_date
) => {
  const booking = await Booking.findOne({
    where: {
      availability_slot_id,

      booking_date,

      status: {
        [Op.notIn]: [
          "REJECTED",
          "CANCELLED",
        ],
      },
    },
  });

  return Boolean(booking);
};

module.exports = {
  bookingInclude,

  formatBooking,
  formatBookingList,

  findBooking,

  verifyStudentBookingOwner,
  verifyTutorBookingOwner,

  canBookTutor,
  canBookAvailability,

  canAcceptBooking,
  canRejectBooking,
  canCancelBooking,
  canCompleteBooking,

  getBookings,
  hasBookingConflict,
};