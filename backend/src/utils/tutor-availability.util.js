const { TutorAvailability } = require('../models');

const NotFoundError = require('../errors/not-found.error');
const ForbiddenError = require('../errors/forbidden.error');

const formatAvailability = (slot) => ({
  availability_slot_id: slot.availability_slot_id,

  day_of_week: slot.day_of_week,

  start_time: slot.start_time,
  end_time: slot.end_time,

  is_active: slot.is_active,
});

const formatAvailabilityList = (slots) => {
  return slots.map(formatAvailability);
};

const findAvailability = async (
  availability_slot_id,
  options = {}
) => {
  const availability = await TutorAvailability.findByPk(
    availability_slot_id,
    options
  );

  if (!availability) {
    throw new NotFoundError(
      "Availability slot not found."
    );
  }

  return availability;
};

const getTutorAvailability = async (
  tutor_profile_id,
  options = {}
) => {
  return TutorAvailability.findAll({
    where: {
      tutor_profile_id,
    },

    order: [
      ["day_of_week", "ASC"],
      ["start_time", "ASC"],
    ],

    ...options,
  });
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const hasTimeConflict = (
  currentSlots,
  newSlot
) => {
  const newStart = timeToMinutes(
    newSlot.start_time
  );

  const newEnd = timeToMinutes(
    newSlot.end_time
  );

  return currentSlots.some((slot) => {
    if (slot.day_of_week !== newSlot.day_of_week) {
      return false;
    }

    const currentStart = timeToMinutes(
      slot.start_time
    );

    const currentEnd = timeToMinutes(
      slot.end_time
    );

    return (
      newStart < currentEnd &&
      newEnd > currentStart
    );
  });
};

const isValidTimeRange = (
  start_time,
  end_time
) => {
  return (
    timeToMinutes(start_time) <
    timeToMinutes(end_time)
  );
};

const verifyTutorAvailabilityOwner = (
  tutorProfile,
  availability
) => {
  if (
    tutorProfile.tutor_profile_id !==
    availability.tutor_profile_id
  ) {
    throw new ForbiddenError(
      "You do not have permission to access this availability slot."
    );
  }
};

const getOtherAvailabilitySlots = (
  slots,
  availability_slot_id
) => {
  return slots.filter(
    (slot) =>
      slot.availability_slot_id !== availability_slot_id
  );
};

module.exports = {
  // Formatters
  formatAvailability,
  formatAvailabilityList,

  // Queries
  findAvailability,
  getTutorAvailability,

  // Time Helpers
  timeToMinutes,
  isValidTimeRange,
  hasTimeConflict,

  // Authorization
  verifyTutorAvailabilityOwner,

  // Collections
  getOtherAvailabilitySlots,
};