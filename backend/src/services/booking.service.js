const { Booking } = require("../models");

const { BadRequestError, ConflictError } = require("../errors/app.error");

const { findStudentProfile } = require("../utils/student-profile.util");

const {
  findTutorProfileById,
  updateTutorCompletedStats,
  findTutorProfile,
} = require("../utils/tutor-profile.util");

const { findAvailability } = require("../utils/tutor-availability.util");

const { findSubjectById } = require("../utils/tutor-subject.util");

const {
  getPagination,
  getPaginationMeta,
} = require("../utils/pagination.util");

const {
  combineBookingDateTime,
  isBookingInPast,
  isMatchingAvailabilityDay,
  hasBookingEnded,
} = require("../utils/booking-date.util");

const {
  bookingInclude,

  formatBooking,
  formatBookingList,

  findBooking,
  getBookings,

  verifyStudentBookingOwner,
  verifyTutorBookingOwner,

  canBookTutor,
  canBookAvailability,

  canAcceptBooking,
  canRejectBooking,
  canCancelBooking,
  canCompleteBooking,

  hasBookingConflict,
} = require("../utils/booking.util");

const createBooking = async (user_id, data) => {
  const studentProfile = await findStudentProfile(user_id);

  const tutorProfile = await findTutorProfileById(data.tutor_profile_id);

  const availability = await findAvailability(data.availability_slot_id);

  /*
   * Business rule:
   * Tutor must currently accept bookings.
   */
  if (!canBookTutor(tutorProfile)) {
    throw new BadRequestError(
      "This tutor is currently unavailable for bookings.",
    );
  }

  /*
   * Business rule:
   * The selected availability slot must be active.
   */
  if (!canBookAvailability(availability)) {
    throw new BadRequestError("This availability slot is currently inactive.");
  }

  /*
   * Verify the requested subject exists.
   */
  await findSubjectById(data.subject_id);

  /*
   * Business rule:
   * Booking date cannot be in the past.
   */
  if (isBookingInPast(data.booking_date)) {
    throw new BadRequestError("Booking date cannot be in the past.");
  }

  /*
   * Business rule:
   * Booking date must correspond to
   * the recurring availability day.
   */
  if (!isMatchingAvailabilityDay(data.booking_date, availability)) {
    throw new BadRequestError(
      "Booking date does not match the selected availability.",
    );
  }

  /*
   * Business rule:
   * Availability must belong to
   * the selected tutor.
   */
  if (availability.tutor_profile_id !== tutorProfile.tutor_profile_id) {
    throw new BadRequestError(
      "Selected availability does not belong to this tutor.",
    );
  }

  /*
   * Business rule:
   * Tutor must teach the requested subject.
   */
  const tutorSubjects = await tutorProfile.getSubjects({
    attributes: ["subject_id"],

    joinTableAttributes: [],
  });

  const teachesSubject = tutorSubjects.some(
    (subject) => subject.subject_id === data.subject_id,
  );

  if (!teachesSubject) {
    throw new BadRequestError("Tutor does not teach the selected subject.");
  }

  /*
   * Build the actual lesson timestamps
   * from the selected recurring slot.
   */
  const booking_start = combineBookingDateTime(
    data.booking_date,
    availability.start_time,
  );

  const booking_end = combineBookingDateTime(
    data.booking_date,
    availability.end_time,
  );

  /*
   * Business rule:
   * Do not allow another booking
   * for the same availability/date.
   */
  if (
    await hasBookingConflict(
      availability.availability_slot_id,
      data.booking_date,
    )
  ) {
    throw new ConflictError("This availability has already been booked.");
  }

  const booking = await Booking.create({
    student_profile_id: studentProfile.student_profile_id,

    tutor_profile_id: tutorProfile.tutor_profile_id,

    availability_slot_id: availability.availability_slot_id,

    subject_id: data.subject_id,

    booking_date: data.booking_date,

    booking_start,

    booking_end,

    booked_hourly_rate: tutorProfile.hourly_rate,

    intro_message: data.intro_message,
  });

  /*
   * Return a fully formatted booking
   * using the standard booking DTO.
   */
  const createdBooking = await findBooking(booking.booking_id, {
    include: bookingInclude,
  });

  return formatBooking(createdBooking);
};

const getStudentBookings = async (user_id, query) => {
  const studentProfile = await findStudentProfile(user_id);

  const { page, limit, offset } = getPagination(query.page, query.limit);

  const { count, rows } = await getBookings(
    {
      student_profile_id: studentProfile.student_profile_id,
    },
    {
      include: bookingInclude,

      limit,

      offset,
    },
  );

  return {
    bookings: formatBookingList(
      rows,
      "STUDENT"
    ),

    pagination: getPaginationMeta(
      count,
      page,
      limit
    ),
  };
};

const getTutorBookings = async (user_id, query) => {
  const tutorProfile = await findTutorProfile(user_id);

  const { page, limit, offset } = getPagination(query.page, query.limit);

  const { count, rows } = await getBookings(
    {
      tutor_profile_id: tutorProfile.tutor_profile_id,
    },
    {
      include: bookingInclude,

      limit,

      offset,
    },
  );

  return {
    bookings: formatBookingList(
      rows,
      "TUTOR"
    ),

    pagination: getPaginationMeta(
      count,
      page,
      limit
    ),
  };
};

const getBookingById = async (user_id, role, booking_id) => {
  const booking = await findBooking(booking_id, {
    include: bookingInclude,
  });

  if (role === "STUDENT") {
    const studentProfile = await findStudentProfile(user_id);

    verifyStudentBookingOwner(studentProfile, booking);
  } else {
    const tutorProfile = await findTutorProfile(user_id);

    verifyTutorBookingOwner(tutorProfile, booking);
  }

  return formatBooking(
    booking,
    role
  );
};

const acceptBooking = async (user_id, booking_id) => {
  const tutorProfile = await findTutorProfile(user_id);

  const booking = await findBooking(booking_id, {
    include: bookingInclude,
  });

  verifyTutorBookingOwner(tutorProfile, booking);

  if (!canAcceptBooking(booking)) {
    throw new BadRequestError("This booking cannot be accepted.");
  }

  await booking.update({
    status: "ACCEPTED",
  });

  return formatBooking(booking);
};

const rejectBooking = async (user_id, booking_id, rejection_reason) => {
  const tutorProfile = await findTutorProfile(user_id);

  const booking = await findBooking(booking_id, {
    include: bookingInclude,
  });

  verifyTutorBookingOwner(tutorProfile, booking);

  if (!canRejectBooking(booking)) {
    throw new BadRequestError("This booking cannot be rejected.");
  }

  await booking.update({
    status: "REJECTED",

    rejection_reason,
  });

  return formatBooking(booking);
};

const cancelBooking = async (user_id, booking_id) => {
  const studentProfile = await findStudentProfile(user_id);

  const booking = await findBooking(booking_id, {
    include: bookingInclude,
  });

  verifyStudentBookingOwner(studentProfile, booking);

  if (!canCancelBooking(booking)) {
    throw new BadRequestError("This booking cannot be cancelled.");
  }

  await booking.update({
    status: "CANCELLED",

    cancelled_by: "STUDENT",

    cancelled_at: new Date(),
  });

  return formatBooking(booking);
};

const completeBooking = async (user_id, booking_id) => {
  const tutorProfile = await findTutorProfile(user_id);

  const booking = await findBooking(booking_id, {
    include: bookingInclude,
  });

  verifyTutorBookingOwner(tutorProfile, booking);

  if (!canCompleteBooking(booking)) {
    throw new BadRequestError("This booking cannot be completed.");
  }


  await booking.update({
    status: "COMPLETED",

    is_completed: true,
  });

  await updateTutorCompletedStats(tutorProfile, booking.booked_hourly_rate);

  return formatBooking(booking);
};

module.exports = {
  createBooking,

  getStudentBookings,
  getTutorBookings,
  getBookingById,

  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
};
