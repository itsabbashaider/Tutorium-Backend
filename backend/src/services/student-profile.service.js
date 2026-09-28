const {
  studentProfileInclude,
  formatStudentProfile,
  formatPublicStudentProfile,
  formatStudentPublicProfile,
  findStudentProfile,
  findStudentProfileById,
} = require("../utils/student-profile.util");

const {
  pickFields,
  hasFields,
} = require("../utils/object.util");

const {
  User,
  Booking,
} = require("../models")

const getProfile = async (user_id) => {
  const studentProfile = await findStudentProfile(user_id, {
    include: studentProfileInclude,
  });

  return formatStudentProfile(studentProfile);
};

const getStudentPublicProfile = async (
  student_profile_id
) => {
  const studentProfile =
    await findStudentProfileById(
      student_profile_id,
      {
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "user_id",
              "full_name",
              "city",
              "avatar_url"
            ],
          },
        ],
      }
    );

  const totalCompleted =
    await Booking.count({
      where: {
        student_profile_id,

        status: "COMPLETED",
      },
    });

  const totalCancelled =
    await Booking.count({
      where: {
        student_profile_id,

        status: "CANCELLED",
      },
    });

  const totalRejected =
    await Booking.count({
      where: {
        student_profile_id,

        status: "REJECTED",
      },
    });

  const finalizedBookings =
    totalCompleted +
    totalCancelled +
    totalRejected;

  const completionRate =
    finalizedBookings === 0
      ? 0
      : (totalCompleted /
          finalizedBookings) *
        100;

  return formatStudentPublicProfile(
    studentProfile,
    completionRate
  );
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
  getStudentPublicProfile,
  updateProfile,
};