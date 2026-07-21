const Joi = require("joi");

const tutorSearchSchema = Joi.object({
  subject: Joi.string().optional(),
  city: Joi.string().optional(),
  teaching_mode: Joi.string()
    .valid("ONLINE", "IN_PERSON", "BOTH")
    .optional(),

  min_price: Joi.number().min(0).optional(),
  max_price: Joi.number().min(0).optional(),
  min_rating: Joi.number().min(1).max(5).optional(),

  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),

  sort_by: Joi.string()
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