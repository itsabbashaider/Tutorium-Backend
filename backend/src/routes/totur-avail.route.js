const express = require("express");

const tutorAvailabilityController = require("../controllers/tutor-avail.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
  createAvailabilitySchema,
  updateAvailabilitySchema,
} = require("../schemas/tutor-availability.schema");

const router = express.Router();

router.use(authenticate);
router.use(authorize("TUTOR"));

router.get(
  "/",
  tutorAvailabilityController.getAvailability
);

router.post(
  "/",
  validate(createAvailabilitySchema),
  tutorAvailabilityController.createAvailability
);

router.patch(
  "/:availability_slot_id",
  validate(updateAvailabilitySchema),
  tutorAvailabilityController.updateAvailability
);

router.delete(
  "/:availability_slot_id",
  tutorAvailabilityController.deleteAvailability
);


module.exports = router;