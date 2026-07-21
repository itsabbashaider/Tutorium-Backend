const express = require("express");

const subjectController = require("../controllers/subjects.controller");
const validate = require("../middlewares/validate.middleware");
const subjectSchema = require("../schemas/subjects.schema");


const router = express.Router();


router.get(
  "/",
  subjectController.getAllSubjects
);


router.get(
  "/search",
  validate(subjectSchema.search, "query"),
  subjectController.searchSubjects
);


module.exports = router;