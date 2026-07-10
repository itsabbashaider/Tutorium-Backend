const Joi = require("joi");

const addSubjectsSchema = Joi.object({
  subject_ids: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
    )
    .min(1)
    .required(),
});

const removeSubjectSchema = Joi.object({
  subject_id: Joi.number()
    .integer()
    .positive()
    .required(),
});

module.exports = {
  addSubjectsSchema,
  removeSubjectSchema,
};