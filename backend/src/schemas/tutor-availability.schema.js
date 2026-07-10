const Joi = require("joi");

const createAvailabilitySchema = Joi.object({
  day_of_week: Joi.number()
    .integer()
    .min(0)
    .max(6)
    .required(),

  start_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),

  end_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),

  is_active: Joi.boolean(),
});

const updateAvailabilitySchema = Joi.object({
  day_of_week: Joi.number()
    .integer()
    .min(0)
    .max(6),

  start_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),

  end_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),

  is_active: Joi.boolean(),
}).min(1);

module.exports = {
  createAvailabilitySchema,
  updateAvailabilitySchema,
};