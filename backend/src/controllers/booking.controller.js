const asyncHandler = require("../middlewares/async-handler.middleware");
const bookingService = require("../services/booking.service");
const STATUS_CODES = require('../constants/status-codes.constant');

const createBooking = asyncHandler(async (
  req,
  res
) => {
  const booking =
    await bookingService.createBooking(
      req.user.user_id,
      req.body
    );

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "Booking created successfully.",
    data: booking,
  });
});

const getStudentBookings = asyncHandler(async (
  req,
  res
) => {
  const bookings =
    await bookingService.getStudentBookings(
      req.user.user_id,
      req.query
    );

  return res.json({
    success: true,
    data: bookings,
  });
});

const getTutorBookings = asyncHandler(async (
  req,
  res
) => {
  const bookings =
    await bookingService.getTutorBookings(
      req.user.user_id,
      req.query
    );

  return res.json({
    success: true,
    data: bookings,
  });
});

const getBookingById = asyncHandler(async (
  req,
  res
) => {
  const booking =
    await bookingService.getBookingById(
      req.user.user_id,
      req.user.role,
      req.params.booking_id
    );

  return res.json({
    success: true,
    data: booking,
  });
});

const acceptBooking = asyncHandler(async (
  req,
  res
) => {
  const booking =
    await bookingService.acceptBooking(
      req.user.user_id,
      req.params.booking_id
    );

  return res.json({
    success: true,
    message: "Booking accepted successfully.",
    data: booking,
  });
});

const rejectBooking = asyncHandler(async (
  req,
  res
) => {
  const booking =
    await bookingService.rejectBooking(
      req.user.user_id,
      req.params.booking_id,
      req.body.rejection_reason
    );

  return res.json({
    success: true,
    message: "Booking rejected successfully.",
    data: booking,
  });
});

const cancelBooking = asyncHandler(async (
  req,
  res
) => {
  const booking =
    await bookingService.cancelBooking(
      req.user.user_id,
      req.params.booking_id
    );

  return res.json({
    success: true,
    message: "Booking cancelled successfully.",
    data: booking,
  });
});

const completeBooking = asyncHandler(async (
  req,
  res
) => {
  const booking =
    await bookingService.completeBooking(
      req.user.user_id,
      req.params.booking_id
    );

  return res.json({
    success: true,
    message: "Booking completed successfully.",
    data: booking,
  });
});

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