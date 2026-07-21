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
    .min("now")
    .required()
    .messages({
      "date.min":
        "Booking date must be today or a future date.",
    }),

  intro_message: Joi.string()
    .trim()
    .max(500)
    .optional(),
});

const rejectBookingSchema = Joi.object({
  rejection_reason: Joi.string()
    .trim()
    .max(1000)
    .required(),
});

module.exports = {
  createBookingSchema,
  rejectBookingSchema,
};