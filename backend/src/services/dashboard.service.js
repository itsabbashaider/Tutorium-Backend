const {
  findStudentProfile,
  findStudentProfileById,
} = require("../utils/student-profile.util");

const {
  findTutorProfile,
  findTutorProfileById,
  updateTutorRatingStats,
} = require("../utils/tutor-profile.util");

const {
  buildStudentDashboard,
  buildTutorDashboard,

  formatStudentPrivateDashboard,
  formatStudentPublicDashboard,

  formatTutorPrivateDashboard,
  formatTutorPublicDashboard
} = require("../utils/dashboard.util")



const getMyStudentDashboard = async (
  user_id
) => {
  const studentProfile = 
    await findStudentProfile(user_id);

  const dashboard = 
    await buildStudentDashboard(
      studentProfile
    );

  return formatStudentPrivateDashboard(
    dashboard
  );
};


const getStudentDashboard = async (
  student_profile_id
) => {
  const studentProfile = 
    await findStudentProfileById(
      student_profile_id
    );

  const dashboard = 
    await buildStudentDashboard(
      studentProfile
    );

  return formatStudentPublicDashboard(
    dashboard
  );
};


const getMyTutorDashboard = async (
  user_id
) => {
  const tutorProfile =
    await findTutorProfile(user_id);

  await updateTutorRatingStats(
    tutorProfile
  );

  const dashboard = 
    await buildTutorDashboard(
      tutorProfile
    );

  return formatTutorPrivateDashboard(
    dashboard,
    tutorProfile
  );
};


const getTutorDashboard = async (
  tutor_profile_id
) => {
  const tutorProfile =
    await findTutorProfileById(
      tutor_profile_id
    );

  const dashboard = 
    await buildTutorDashboard(
      tutorProfile
    );

  return formatTutorPublicDashboard(
    dashboard,
    tutorProfile
  );
};

module.exports = {
  getTutorDashboard,
  getMyTutorDashboard,
  
  getStudentDashboard,
  getMyStudentDashboard,
}