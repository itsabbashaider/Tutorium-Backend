const express = require("express");

const authRoutes = require("./auth.route");

const tutorSearchRoutes = require("./tutor-profile.route");
const tutorProfileRoutes = require("./tutor-profile.route");
const tutorSubjectRoutes = require("./tutor-subject.route");
const tutorAvailabilityRoutes = require("./totur-avail.route");

const bookingRoutes = require('./booking.route')
const reviewRoutes = require('./review.route')

const studentProfileRoutes = require("./student-profile.route");

const router = express.Router();

// Authentication
router.use("/auth", authRoutes);

// Tutor
router.use("/tutors", tutorSearchRoutes);
router.use("/tutor/profile", tutorProfileRoutes);
router.use("/tutor/subjects", tutorSubjectRoutes);
router.use("/bookings", bookingRoutes);
router.use("/tutor/availability", tutorAvailabilityRoutes);

// Student
router.use("/student/profile", studentProfileRoutes);

// Reviews
router.use("/reviews", reviewRoutes);

module.exports = router;