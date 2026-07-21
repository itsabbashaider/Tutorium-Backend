const subjectService = require("../services/subject.service");
const asyncHandler = require("../middlewares/async-handler.middleware");
const STATUS_CODES = require("../constants/status-codes.constant");


const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await subjectService.getAllSubjects();

  res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Subjects fetched successfully.",
    data: subjects,
  });
});


const searchSubjects = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const subjects = await subjectService.searchSubjects(search);

  res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Subjects retrieved successfully.",
    data: subjects,
  });
});


module.exports = {
  getAllSubjects,
  searchSubjects,
};