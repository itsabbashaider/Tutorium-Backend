const Joi = require("joi");

const tutorSearchSchema = Joi.object({
  subject: Joi.string().optional(),
  city: Joi.string().optional(),
  teachingMode: Joi.string()
    .valid("ONLINE", "IN_PERSON", "BOTH")
    .optional(),

  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  minRating: Joi.number().min(1).max(5).optional(),

  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),

  sortBy: Joi.string()
    .valid(
      "lowest_price",
      "highest_price",
      "top_rated",
      "recently_added"
    )
    .default("top_rated"),
});

module.exports = {
  tutorSearchSchema,
};