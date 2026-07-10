const Joi = require("joi");

const updateStudentProfileSchema = Joi.object({
  academic_level: Joi.string()
    .max(100)
    .optional(),

  learning_goals: Joi.string()
    .max(1000)
    .optional(),
}).min(1);

module.exports = {
  updateStudentProfileSchema,
};