const { TutorAvailability } = require("../models");

const { BadRequestError, ConflictError } = require("../errors/app.error");

const { findTutorProfile } = require("../utils/tutor-profile.util");

const { 
  availabilityFields,
 } = require('../constants/tutor-avail.constant');

const {
  pickFields,
  hasFields,
} = require("../utils/object.util");

const {
  formatAvailability,
  formatAvailabilityList,

  findAvailability,
  getTutorAvailability,

  isValidTimeRange,
  hasTimeConflict,

  verifyTutorAvailabilityOwner,
  getOtherAvailabilitySlots,
} = require("../utils/tutor-availability.util");

const getAvailability = async (user_id) => {
  const tutorProfile = await findTutorProfile(user_id);

  const availability = await getTutorAvailability(
    tutorProfile.tutor_profile_id
  );

  return formatAvailabilityList(availability);
};

const createAvailability = async (user_id, data) => {
  const tutorProfile = await findTutorProfile(user_id);

  const availabilityData = pickFields(
    data,
    availabilityFields
  );

  if (
    !isValidTimeRange(
      availabilityData.start_time,
      availabilityData.end_time
    )
  ) {
    throw new BadRequestError(
      "End time must be later than start time."
    );
  }

  const currentSlots = await getTutorAvailability(
    tutorProfile.tutor_profile_id
  );

  if (hasTimeConflict(currentSlots, availabilityData)) {
    throw new ConflictError(
      "Availability slot overlaps an existing slot."
    );
  }

  const availability = await TutorAvailability.create({
    tutor_profile_id: tutorProfile.tutor_profile_id,
    ...availabilityData,
  });

  return formatAvailability(availability);
};

const updateAvailability = async (
  user_id,
  availability_slot_id,
  data
) => {
  const tutorProfile = await findTutorProfile(user_id);

  const availability = await findAvailability(
    availability_slot_id
  );

  verifyTutorAvailabilityOwner(
    tutorProfile,
    availability
  );

  const updateFields = pickFields(
    data, 
    availabilityFields
  );

  const updateData = {
    ...availability.toJSON(),
    ...updateFields,
  };

  if (
    !isValidTimeRange(
      updateData.start_time,
      updateData.end_time
    )
  ) {
    throw new BadRequestError(
      "End time must be later than start time."
    );
  }

  const currentSlots = await getTutorAvailability(
    tutorProfile.tutor_profile_id
  );

  const otherSlots = getOtherAvailabilitySlots(
    currentSlots,
    availability.availability_slot_id
  );

  if (hasTimeConflict(otherSlots, updateData)) {
    throw new ConflictError(
      "Availability slot overlaps an existing slot."
    );
  }

  if (!hasFields(updateFields)) {
    return formatAvailability(availability);
  }

  await availability.update(updateFields);

  return formatAvailability(availability);
};

const deleteAvailability = async (
  user_id,
  availability_slot_id
) => {
  const tutorProfile = await findTutorProfile(user_id);

  const availability = await findAvailability(
    availability_slot_id
  );

  verifyTutorAvailabilityOwner(
    tutorProfile,
    availability
  );

  await availability.destroy();

  return true;
};

module.exports = {
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
};