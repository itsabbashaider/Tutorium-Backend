const {
  Booking,
  Review,
  TutorAvailability,
} = require("../models");

const {
  fn,
  col,
} = require("sequelize");

const getBookingStats = async (
  where
) => {
  const totalBookings =
    await Booking.count({
      where,
    });

  const bookingStats =
    await Booking.findAll({
      where,

      attributes: [
        "status",
        [
          fn("COUNT", col("status")),
          "count",
        ],
      ],

      group: ["status"],
      raw: true,
    });

  const stats = {
    PENDING: 0,
    ACCEPTED: 0,
    REJECTED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  bookingStats.forEach((booking) => {
    stats[booking.status] =
      Number(booking.count);
  });
  const finalizedBookings =
    stats.REJECTED +
    stats.COMPLETED +
    stats.CANCELLED;

  const completionRate =
    finalizedBookings > 0
      ? Number(
          (
            (stats.COMPLETED /
              finalizedBookings) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    totalBookings,

    pendingBookings: stats.PENDING,
    acceptedBookings: stats.ACCEPTED,
    rejectedBookings: stats.REJECTED,
    completedBookings: stats.COMPLETED,
    cancelledBookings: stats.CANCELLED,

    finalizedBookings,
    completionRate,
  };
};

const getReviewStats = async (
  include
) => {
  const totalReviews = 
    await Review.count({
      include,
    });

  return {
    totalReviews,
  };
};

const getAvailabilityStats = async (
  tutor_profile_id
) => {
  const activeSlots =
    await TutorAvailability.count({
      where: {
        tutor_profile_id,
        is_active: true,
      },
    });

  return {
    activeSlots,
  };
};

const buildStudentDashboard = async (
  studentProfile
) => {
  const bookingStats =
    await getBookingStats({
      student_profile_id:
        studentProfile.student_profile_id,
    });

  const reviewStats =
    await getReviewStats([
      {
        model: Booking,
        as: "booking",
        where: {
          student_profile_id:
            studentProfile.student_profile_id,
        },
        attributes: [],
      },
    ]);

  return {
    bookingStats,
    reviewStats,
  };
};

const buildTutorDashboard = async (
  tutorProfile
) => {
  const bookingStats =
    await getBookingStats({
      tutor_profile_id:
        tutorProfile.tutor_profile_id,
    });

  const reviewStats =
    await getReviewStats([
      {
        model: Booking,
        as: "booking",
        where: {
          tutor_profile_id:
            tutorProfile.tutor_profile_id,
        },
        attributes: [],
      },
    ]);

  const availabilityStats =
    await getAvailabilityStats(
      tutorProfile.tutor_profile_id
    );

  return {
    bookingStats,
    reviewStats,
    availabilityStats,
  };
};

const formatStudentPublicDashboard = (
  dashboard
) => {
  return {
    booking_stats: {
      completed_bookings:
        dashboard.bookingStats.completedBookings,
    },

    review_stats: {
      total_reviews:
        dashboard.reviewStats.totalReviews,
    },
  };
};

const formatStudentPrivateDashboard = (
  dashboard
) => {
  const publicDashboard =
    formatStudentPublicDashboard(
      dashboard
    );

  return {
    ...publicDashboard,

    booking_stats: {
      ...publicDashboard.booking_stats,

      total_bookings:
        dashboard.bookingStats.totalBookings,

      pending_bookings:
        dashboard.bookingStats.pendingBookings,

      accepted_bookings:
        dashboard.bookingStats.acceptedBookings,

      rejected_bookings:
        dashboard.bookingStats.rejectedBookings,

      cancelled_bookings:
        dashboard.bookingStats.cancelledBookings,

      finalized_bookings:
        dashboard.bookingStats.finalizedBookings,

      completion_rate:
        dashboard.bookingStats.completionRate,
    },
  };
};

const formatTutorPublicDashboard = (
  dashboard,
  tutorProfile
) => {
  return {
    tutor_stats: {
      average_rating:
        Number(tutorProfile.avg_rating),

      completed_sessions:
        tutorProfile.total_completed_sessions,

      total_reviews:
        dashboard.reviewStats.totalReviews,
    },
  };
};

const formatTutorPrivateDashboard = (
  dashboard,
  tutorProfile
) => {
  const publicDashboard =
    formatTutorPublicDashboard(
      dashboard,
      tutorProfile
    );

  return {
    ...publicDashboard,

    tutor_stats: {
      ...publicDashboard.tutor_stats,

      total_earnings:
        Number(
          tutorProfile.total_earnings
        ),
    },

    booking_stats: {
      total_bookings:
        dashboard.bookingStats.totalBookings,

      pending_bookings:
        dashboard.bookingStats.pendingBookings,

      accepted_bookings:
        dashboard.bookingStats.acceptedBookings,

      rejected_bookings:
        dashboard.bookingStats.rejectedBookings,

      completed_bookings:
        dashboard.bookingStats.completedBookings,

      cancelled_bookings:
        dashboard.bookingStats.cancelledBookings,
    },

    availability_stats: {
      active_slots:
        dashboard.availabilityStats
          .activeSlots,
    },
  };
};


module.exports = {
  getBookingStats,
  getReviewStats,
  getAvailabilityStats,

  buildStudentDashboard,
  buildTutorDashboard,  

  formatStudentPublicDashboard,
  formatTutorPublicDashboard,

  formatStudentPrivateDashboard,
  formatTutorPrivateDashboard,
  
}