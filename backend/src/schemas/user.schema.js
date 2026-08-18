const Joi = require("joi");

const updateUserProfileSchema = Joi.object({
  full_name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .optional(),

  city: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional(),

  phone_number: Joi.string()
    .trim()
    .max(30)
    .allow("")
    .optional(),

  timezone: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional(),
}).min(1);

module.exports = {
  updateUserProfileSchema,
};