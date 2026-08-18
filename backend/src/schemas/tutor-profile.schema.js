const Joi = require("joi");

const updateTutorProfileSchema = Joi.object({
  professional_bio: Joi.string()
    .max(1000)
    .allow(""),

  hourly_rate: Joi.number()
    .positive()
    .precision(2),

  teaching_mode: Joi.string()
    .valid("ONLINE", "IN_PERSON", "BOTH"),

  is_available: Joi.boolean(),
}).min(1);

module.exports = {
  updateTutorProfileSchema,
};