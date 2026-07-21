const {
  StudentProfile,
  User,
} = require("../models");

const { NotFoundError } = require("../errors/app.error");

const studentProfileInclude = [
  {
    model: User,
    as: "user",
    attributes: [
      "user_id",
      "full_name",
      "email",
      "city",
      "phone_number",
      "timezone",
    ],
  },
];

const formatStudentProfile = (profile) => ({
  student_profile_id: profile.student_profile_id,

  academic_level: profile.academic_level,
  learning_goals: profile.learning_goals,

  user: {
    user_id: profile.user.user_id,
    full_name: profile.user.full_name,
    email: profile.user.email,
    city: profile.user.city,
    phone_number: profile.user.phone_number,
    timezone: profile.user.timezone,
  },
});

const findStudentProfile = async (
  user_id,
  options = {}
) => {
  const studentProfile =
    await StudentProfile.findOne({
      where: {
        user_id,
      },
      ...options,
    });

  if (!studentProfile) {
    throw new NotFoundError(
      "Student profile not found."
    );
  }

  return studentProfile;
};

const findStudentProfileById = async (
  student_profile_id,
  options = {}
) => {
  const studentProfile =
    await StudentProfile.findByPk(
      student_profile_id,
      options
    );

  if (!studentProfile) {
    throw new NotFoundError(
      "Student profile not found."
    );
  }

  return studentProfile;
};


module.exports = {
  studentProfileInclude,
  formatStudentProfile,
  findStudentProfile,
  findStudentProfileById
};