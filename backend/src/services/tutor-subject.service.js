const NotFoundError = require('../errors/not-found.error');

const { findTutorProfile } = require('../utils/tutor-profile.util');
const {
  tutorSubjectInclude,
  formatSubjects,
  findSubjectsByIds,
  getNewSubjects,
  getCurrentSubjects,
  findCurrentSubject,
} = require("../utils/tutor-subject.util");

const getSubjects = async (user_id) => {

  const tutorProfile = await findTutorProfile(user_id, {
    include: tutorSubjectInclude,
  });

  return formatSubjects(tutorProfile.subjects);
};

const addSubjects = async (user_id, subject_ids) => {
  const tutorProfile = await findTutorProfile(user_id);

  const subjects = await findSubjectsByIds(subject_ids);

  if (subjects.length !== subject_ids.length) {
    throw new NotFoundError("One or more subjects were not found.");
  }

  const currentSubjects = await getCurrentSubjects(tutorProfile);

  const newSubjects = getNewSubjects(
    currentSubjects,
    subjects
  );

  if (newSubjects.length > 0) {
    await tutorProfile.addSubjects(newSubjects);
  }

  return getSubjects(user_id);
};

const removeSubject = async (user_id, subject_id) => {

  const tutorProfile = await findTutorProfile(user_id);

  const currentSubjects = await getCurrentSubjects(tutorProfile);

  const subject = findCurrentSubject(
    currentSubjects,
    subject_id
  );

  if (!subject) {
    throw new NotFoundError('Subject is not assigned to this tutor');
  }

  await tutorProfile.removeSubject(subject);

  return getSubjects(user_id);
}

module.exports = {
  getSubjects,
  addSubjects,
  removeSubject,
}
