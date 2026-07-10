const {
  TutorProfile,
  User,
  Subject,
} = require("../models");

const {
  buildUserFilters,
  buildTutorFilters,
  buildSubjectFilter,
  buildSort,
} = require("../utils/tutor-query.util");

const {
  getPagination,
  getPaginationMeta,
} = require("../utils/pagination.util");

const getTutors = async (filters) => {
  const userWhere = buildUserFilters(filters);

  const tutorWhere = buildTutorFilters(filters);

  const subjectFilter = buildSubjectFilter(filters.subject);

  const order = buildSort(filters.sort_by);

  const { page, limit, offset } = getPagination(
    filters.page,
    filters.limit
  );

  const { count, rows } = await TutorProfile.findAndCountAll({
    where: tutorWhere,

    include: [
      {
        model: User,
        as: "user",
        where: userWhere,
        attributes: [
          "user_id",
          "full_name",
          "city",
        ],
      },
      {
        model: Subject,
        as: "subjects",
        attributes: [
          "subject_id",
          "subject_name",
        ],
        through: {
          attributes: [],
        },
        where: subjectFilter.where,
        required: subjectFilter.required,
      },
    ],

    order,
    limit,
    offset,

    distinct: true,
  });

  return {
    ...getPaginationMeta(count, page, limit),
    tutors: rows,
  };
};

module.exports = {
  getTutors,
};