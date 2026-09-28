const { StudentProfile, User } = require("../models");

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
      "avatar_url",
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
    avatar_url: profile.user?.avatar_url || null,
    phone_number: profile.user.phone_number,
    timezone: profile.user.timezone,
  },
});

const formatStudentPublicProfile = (studentProfile, completionRate = 0) => {
  return {
    student_profile_id: studentProfile.student_profile_id,

    academic_level: studentProfile.academic_level,

    learning_goals: studentProfile.learning_goals,

    completion_rate: Number(completionRate.toFixed(1)),

    user: studentProfile.user
      ? {
          user_id: studentProfile.user.user_id,

          full_name: studentProfile.user.full_name,

          avatar_url: studentProfile.user?.avatar_url || null,

          city: studentProfile.user.city,
        }
      : null,
  };
};

const findStudentProfile = async (user_id, options = {}) => {
  const studentProfile = await StudentProfile.findOne({
    where: {
      user_id,
    },
    ...options,
  });

  if (!studentProfile) {
    throw new NotFoundError("Student profile not found.");
  }

  return studentProfile;
};

const findStudentProfileById = async (student_profile_id, options = {}) => {
  const studentProfile = await StudentProfile.findByPk(
    student_profile_id,
    options,
  );

  if (!studentProfile) {
    throw new NotFoundError("Student profile not found.");
  }

  return studentProfile;
};

module.exports = {
  studentProfileInclude,
  formatStudentProfile,
  formatStudentPublicProfile,
  findStudentProfile,
  findStudentProfileById,
};
