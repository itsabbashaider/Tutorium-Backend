const Joi = require("joi");

const createReviewSchema = Joi.object({
  booking_id: Joi.string()
    .guid({ version: "uuidv7" })
    .required()
    .messages({
      "string.guid":
        "Booking ID must be a valid UUIDv7.",
      "any.required":
        "Booking ID is required.",
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.min":
        "Rating must be between 1 and 5.",
      "number.max":
        "Rating must be between 1 and 5.",
      "any.required":
        "Rating is required.",
    }),

  comment: Joi.string()
    .trim()
    .max(1000)
    .allow("")
    .optional()
    .messages({
      "string.max":
        "Comment must not exceed 1000 characters.",
    }),
});

module.exports = {
  createReviewSchema,
};