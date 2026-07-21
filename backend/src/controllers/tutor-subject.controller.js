const STATUS_CODES = require('../constants/status-codes.constant')

const tutorSubjectService = require('../services/tutor-subject.service')

const getSubjects = async (req, res) => {
  const subjects = await tutorSubjectService.getSubjects(
    req.user.user_id
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: subjects,
  });
};

const addSubjects = async (req, res) => {
  const subjects = await tutorSubjectService.addSubjects(
    req.user.user_id,
    req.body.subject_ids
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Subject added successfully.',
    data: subjects
  });
};

const removeSubject = async (req, res) => {
  const subjects = await tutorSubjectService.removeSubject(
    req.user.user_id,
    req.params.subject_id
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Subject removed successfully.',
    data: subjects
  });
};

module.exports = {
  getSubjects,
  addSubjects,
  removeSubject,
}