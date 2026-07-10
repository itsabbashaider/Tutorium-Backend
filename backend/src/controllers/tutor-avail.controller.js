const STATUS_CODES = require('../constants/status-codes.constant');

const tutorAvailabilityService = require('../services/tutor-availability.service');


const getAvailability = async (req, res) => {
  const availability = await tutorAvailabilityService.getAvailability(
    req.user.user_id
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: availability,
  });
};

const createAvailability = async (req, res) => {
  const availability = await tutorAvailabilityService.createAvailability(
    req.user.user_id,
    req.body
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Availability slot created successfully.',
    data: availability,
  });
};

const updateAvailability = async (req, res) => {
  const availability = await tutorAvailabilityService.updateAvailability(
    req.user.user_id,
    req.params.availability_slot_id,
    req.body
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Availability slot updated successfully.',
    data: availability,
  });
};

const deleteAvailability = async (req, res) => {
  const availability = await tutorAvailabilityService.deleteAvailability(
    req.user.user_id,
    req.params.availability_slot_id
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Availability slot deleted successfully.',
    data: availability,
  });
};

module.exports = {
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
}

