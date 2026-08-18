const { Op } = require("sequelize");
const { Subject } = require("../models");

const { NotFoundError } = require("../errors/app.error");


const formatSubject = (subject) => ({
  subject_id: subject.subject_id,

  subject_name: subject.subject_name,
  description: subject.description,

  created_at: subject.created_at,
  updated_at: subject.updated_at,
});

const formatSubjectList = (subjects) => {
  return subjects.map((subject) => formatSubject(subject));
};

const findSubject = async (
  subject_id,
  options = {}
) => {

  const subject = await Subject.findByPk(
    subject_id,
    options
  );

  if (!subject) {
    throw new NotFoundError("Subject not found.");
  }

  return subject;
};

const findSubjectByName = async (
  subject_name,
  options = {}
) => {

  const subject = await Subject.findOne({
    where: {
      subject_name,
    },

    ...options
  });

  return subject;
};

const getSubjects = async (
  options = {}
) => {

  const subjects = await Subject.findAll({
    order: [
      ["subject_name", "ASC"],
    ],
    ...options
  })

  return subjects;
};

const searchSubjects = async (search, options = {}) => {
  if (!search?.trim()) {
    return [];
  }

  const subjects = await Subject.findAll({
    where: {
      subject_name: {
        [Op.iLike]: `${search.trim()}%`,
      },
    },
    order: [["subject_name", "ASC"]],
    limit: 10,
    ...options,
  });

  return subjects;
};

module.exports = {
  formatSubject,
  findSubjectByName,
  formatSubjectList,
  findSubject,
  getSubjects,
  searchSubjects,
};