const express = require("express");

const router = express.Router();

const tutorSubjectController = require("../controllers/tutor-subject.controller");

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");
const asyncHandler = require("../middlewares/async-handler.middleware");

const {
  addSubjectsSchema,
  removeSubjectSchema,
} = require("../schemas/tutor-subject.schema");

router.get(
  "/",
  protect,
  authorize("TUTOR"),
  asyncHandler(tutorSubjectController.getSubjects)
);

router.post(
  "/",
  protect,
  authorize("TUTOR"),
  validate(addSubjectsSchema),
  asyncHandler(tutorSubjectController.addSubjects)
);

router.delete(
  "/:subject_id",
  protect,
  authorize("TUTOR"),
  validate(removeSubjectSchema, "params"),
  asyncHandler(tutorSubjectController.removeSubject)
);

module.exports = router;