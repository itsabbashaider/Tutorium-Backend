const {
  findTutors,
  findTutorById,
  formatTutorList,
  formatTutorProfile,
  tutorProfileInclude,
  tutorSearchInclude,
} = require("../utils/tutor-profile.util");

const {
  buildUserFilters,
  buildTutorFilters,
  buildSubjectFilter,
  buildSort,
} = require("../utils/tutor-query.util");

const {
  getTutorAvailability,
  formatAvailabilityList,
} = require("../utils/tutor-availability.util");

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

  const { count, rows } = await findTutors({
    where: tutorWhere,

    include: [
      {
        ...tutorSearchInclude[0],
        where: userWhere,
      },
      {
        ...tutorSearchInclude[1],
        where: subjectFilter.where,
        required: subjectFilter.required,
      },
    ],

    order,
    limit,
    offset,
  });

  return {
    tutors: formatTutorList(rows),
    pagination: getPaginationMeta(
      count,
      page,
      limit
    ),
  };
};

const getTutorById = async (
  tutor_profile_id
) => {
  const tutor = await findTutorById(
    tutor_profile_id,
    {
      include: tutorProfileInclude,
    }
  );

  return formatTutorProfile(tutor);
};

const getTutorAvailabilityByTutor = async (
  tutor_profile_id
) => {
  const availability =
    await getTutorAvailability(
      tutor_profile_id
    );

  return formatAvailabilityList(
    availability
  );
};

module.exports = {
  getTutors,
  getTutorById,
  getTutorAvailabilityByTutor,
};