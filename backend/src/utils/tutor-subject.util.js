const { Subject } = require('../models');

const { NotFoundError } = require('../errors/app.error');

  const tutorSubjectInclude = [
  {
    model: Subject,
    as: "subjects",
    attributes: [
      "subject_id",
      "subject_name",
    ],
    through: {
      attributes: [],
    },
  },
];

const formatSubjects = (subjects) => {
  return subjects.map((subject) => ({
    subject_id: subject.subject_id,
    subject_name: subject.subject_name,
  }));
};

const findSubjectsByIds = async (subject_ids) => {
  return await Subject.findAll({
    where: {
      subject_id: subject_ids,
    },
  });
};

const getNewSubjects = (currentSubjects, requestedSubjects) => {
  const currentSubjectIds = new Set(
    currentSubjects.map((subject) => subject.subject_id)
  );

  return requestedSubjects.filter(
    (subject) => !currentSubjectIds.has(subject.subject_id)
  );
};

const getCurrentSubjects = async (tutorProfile) => {
  return await tutorProfile.getSubjects({
    attributes: [
      "subject_id",
      "subject_name",
    ],
    joinTableAttributes: [],
  });
};


const findCurrentSubject = (
  currentSubjects,
  subject_id
) => {
  return currentSubjects.find(
    (subject) => subject.subject_id === subject_id
  );
};

const findSubjectById = async (
  subject_id
) => {
  const subject = await Subject.findByPk(
    subject_id
  );

  if (!subject) {
    throw new NotFoundError(
      "Subject not found."
    );
  }

  return subject;
};

module.exports = {
  tutorSubjectInclude,
  formatSubjects,

  findSubjectById,
  findSubjectsByIds,

  getNewSubjects,
  getCurrentSubjects,
  findCurrentSubject,
};