const express = require("express");

const userController = require("../controllers/user.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/validate.middleware");
const { uploadAvatar } = require("../middlewares/upload.middleware");

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

router.patch(
  "/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  userController.updateAvatar
);

module.exports = router;