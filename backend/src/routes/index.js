const express = require("express");

const authRoutes = require("./auth.route");

const userRoutes = require("./user.route");

const tutorSearchRoutes = require("./tutor.route");
const tutorProfileRoutes = require("./tutor-profile.route");
const tutorSubjectRoutes = require("./tutor-subject.route");
const tutorAvailabilityRoutes = require("./totur-avail.route");

const bookingRoutes = require('./booking.route');
const reviewRoutes = require('./review.route');
const dashboardRoutes = require("./dashboard.route");

const studentProfileRoutes = require("./student-profile.route");

const subjectRoutes = require("./subjects.route");

const router = express.Router();

// Authentication
router.use("/auth", authRoutes);

// User
router.use("/users", userRoutes);

// Tutor
router.use("/tutors", tutorSearchRoutes);
router.use("/tutor/profile", tutorProfileRoutes);
router.use("/tutor/subjects", tutorSubjectRoutes);
router.use("/bookings", bookingRoutes);
router.use("/tutor/availability", tutorAvailabilityRoutes);

// Student
router.use("/student", studentProfileRoutes);

// Reviews
router.use("/reviews", reviewRoutes);

// Subjects
router.use("/subjects", subjectRoutes);

// Dashboard
router.use("/dashboard", dashboardRoutes);

module.exports = router;