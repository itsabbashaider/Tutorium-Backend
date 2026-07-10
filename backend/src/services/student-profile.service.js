const {
  studentProfileInclude,
  formatStudentProfile,
  findStudentProfile,
} = require('../utils/student-profile.util');

const {
  pickFields,
  hasFields,
} = require('../utils/object.util');


const getProfile = async (user_id) => {
  const studentProfile = await findStudentProfile(user_id, {
    include: studentProfileInclude,
  });

  return formatStudentProfile(studentProfile);
};


const updateProfile = async (user_id, data) => {
  const studentProfile = await findStudentProfile(user_id, {
    include: studentProfileInclude,
  });

  const updateData = pickFields(data, [
    "academic_level",
    "learning_goals",
  ]);

  if (!hasFields(updateData)) {
    return formatStudentProfile(studentProfile);
  }

  await studentProfile.update(updateData);

  return formatStudentProfile(studentProfile);
};

module.exports = {
  getProfile,
  updateProfile,
}
