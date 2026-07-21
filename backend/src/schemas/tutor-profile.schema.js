const Joi = require("joi");

const updateTutorProfileSchema = Joi.object({
  professional_bio: Joi.string()
    .max(1000)
    .required(),

  hourly_rate: Joi.number()
    .positive()
    .precision(2)
    .required(),

  teaching_mode: Joi.string()
    .valid("ONLINE", "IN_PERSON", "BOTH")
    .required(),
});

module.exports = {
  updateTutorProfileSchema,
};