const STATUS_CODES = require("../constants/status-codes.constant");

const tutorSearchService = require("../services/tutor-search.service");

const searchTutors = async (req, res) => {
  const result = await tutorSearchService.getTutors(req.query);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: result,
  });
};

module.exports = {
  searchTutors,
};