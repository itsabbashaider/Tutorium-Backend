const Joi = require("joi");

const createBookingSchema = Joi.object({
  tutor_profile_id: Joi.string()
    .guid({ version: "uuidv7" })
    .required(),

  subject_id: Joi.string()
    .guid({ version: "uuidv7" })
    .required(),

  availability_slot_id: Joi.string()
    .guid({ version: "uuidv7" })
    .required(),

  booking_date: Joi.date()
    .required()
    .custom((value, helpers) => {
      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const bookingDate = new Date(
        value
      );

      bookingDate.setHours(
        0,
        0,
        0,
        0
      );

      if (bookingDate < today) {
        return helpers.message(
          "Booking date must be today or a future date."
        );
      }

      return value;
    }),

  intro_message: Joi.string()
    .trim()
    .max(500)
    .optional(),
});

const rejectBookingSchema = Joi.object({
  rejection_reason: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required()
    .messages({
      "string.empty":
        "Rejection reason is required.",
      "string.min":
        "Rejection reason is required.",
      "string.max":
        "Rejection reason must not exceed 1000 characters.",
      "any.required":
        "Rejection reason is required.",
    }),
});

module.exports = {
  createBookingSchema,
  rejectBookingSchema,
};