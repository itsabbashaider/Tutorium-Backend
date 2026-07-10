const Joi = require("joi");

const updateTutorProfileSchema = Joi.object({
  professional_bio: Joi.string()
    .max(1000)
    .optional(),

  hourly_rate: Joi.number()
    .min(0)
    .optional(),

  teaching_mode: Joi.string()
    .valid("ONLINE", "IN_PERSON", "BOTH")
    .optional(),
});

module.exports = {
  updateTutorProfileSchema,
};