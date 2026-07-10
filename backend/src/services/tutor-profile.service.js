const {
  formatTutorProfile,
  findTutorProfile,
  tutorProfileInclude,
} = require("../utils/tutor-profile.util");

const {
  pickFields,
  hasFields,
} = require("../utils/object.util");

const getProfile = async (user_id) => {
  const tutorProfile = await findTutorProfile(user_id, {
    include: tutorProfileInclude,
  });

  return formatTutorProfile(tutorProfile);
};

const updateProfile = async (user_id, data) => {
  const tutorProfile = await findTutorProfile(user_id);

  const updateData = pickFields(data, [
    "professional_bio",
    "hourly_rate",
    "teaching_mode",
  ]);

  if (!hasFields(updateData)) {
    return getProfile(user_id);
  }

  await tutorProfile.update(updateData);

  return getProfile(user_id);
};

module.exports = {
  getProfile,
  updateProfile,
};