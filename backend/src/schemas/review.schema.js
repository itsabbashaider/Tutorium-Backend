const Joi = require("joi");

const createReviewSchema = Joi.object({
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
    }),

  review_text: Joi.string()
    .max(1000)
    .optional(),
});

module.exports = {
  createReviewSchema,
};