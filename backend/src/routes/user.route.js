const express = require("express");

const userController = require("../controllers/user.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/validate.middleware");

const {
  updateUserProfileSchema,
} = require("../schemas/user.schema");

const router = express.Router();

router.get(
  "/profile",
  authenticate,
  userController.getProfile
);

router.patch(
  "/profile",
  authenticate,
  validateRequest(updateUserProfileSchema),
  userController.updateProfile
);

module.exports = router;