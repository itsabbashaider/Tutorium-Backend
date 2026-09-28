const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const tutorRoutes = require("./tutor.route");
const bookingRoutes = require("./booking.route");
const reviewRoutes = require("./review.route");
const dashboardRoutes = require("./dashboard.route");
const studentProfileRoutes = require("./student-profile.route");
const subjectRoutes = require("./subjects.route");
const onboardingRoutes = require("./role-selection.route");

const router = express.Router();


router.use("/onboarding", onboardingRoutes);

// Authentication
router.use("/auth", authRoutes);

// User
router.use("/users", userRoutes);

// Tutor (all sub-routes now live inside tutor.route.js)
router.use(["/tutors", "/tutor"], tutorRoutes);

// Bookings
router.use("/bookings", bookingRoutes);

// Student
router.use("/student", studentProfileRoutes);

// Reviews
router.use("/reviews", reviewRoutes);

// Subjects
router.use("/subjects", subjectRoutes);

// Dashboard
router.use("/dashboard", dashboardRoutes);

module.exports = router;