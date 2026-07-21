const STATUS_CODES = require("../constants/status-codes.constant");

const tutorSearchService = require("../services/tutor-search.service");

const asyncHandler = require("../middlewares/async-handler.middleware");

const searchTutors = asyncHandler(
  async (req, res) => {
    const result =
      await tutorSearchService.getTutors(
        req.query
      );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: result,
    });
  }
);

const getTutorById = asyncHandler(
  async (req, res) => {
    const tutor =
      await tutorSearchService.getTutorById(
        req.params.tutor_profile_id
      );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: tutor,
    });
  }
);

const getTutorAvailabilityByTutor = asyncHandler(
  async (req, res) => {
    const availability =
      await tutorSearchService.getTutorAvailabilityByTutor(
        req.params.tutor_profile_id
      );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: availability,
    });
  }
);

module.exports = {
  searchTutors,
  getTutorById,
  getTutorAvailabilityByTutor,
};