const Joi = require("joi");

const subjectSchema = {
  search: Joi.object({
    search: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required(),
  }),
};

module.exports = subjectSchema;