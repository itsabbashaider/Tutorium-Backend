const Joi = require("joi");

const addSubjectsSchema = Joi.object({
  subject_ids: Joi.array()
    .items(
      Joi.string()
        .uuid()
        .required()
    )
    .min(1)
    .required()
});

const removeSubjectSchema = Joi.object({
  subject_id: Joi.string()
    .uuid()
    .required(),
});

module.exports = {
  addSubjectsSchema,
  removeSubjectSchema,
};