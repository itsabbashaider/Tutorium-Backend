const express = require("express");

const bookingController = require("../controllers/booking.controller");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createBookingSchema,
  rejectBookingSchema,
} = require("../schemas/booking.schema");

const router = express.Router();

router.use(authenticate);

// Student
router.post(
  "/",
  authorize("STUDENT"),
  validate(createBookingSchema),
  bookingController.createBooking
);

router.get(
  "/student",
  authorize("STUDENT"),
  bookingController.getStudentBookings
);

router.patch(
  "/:booking_id/cancel",
  authorize("STUDENT"),
  bookingController.cancelBooking
);

// Tutor
router.get(
  "/tutor",
  authorize("TUTOR"),
  bookingController.getTutorBookings
);

router.patch(
  "/:booking_id/accept",
  authorize("TUTOR"),
  bookingController.acceptBooking
);

router.patch(
  "/:booking_id/reject",
  authorize("TUTOR"),
  validate(rejectBookingSchema),
  bookingController.rejectBooking
);

router.patch(
  "/:booking_id/complete",
  authorize("TUTOR"),
  bookingController.completeBooking
);

// Shared
router.get(
  "/:booking_id",
  authorize("STUDENT", "TUTOR"),
  bookingController.getBookingById
);

module.exports = router;