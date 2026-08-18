const {
  findTutors,
  findTutorById,
  formatTutorList,
  formatTutorPublicProfile,
  tutorSearchInclude,
  tutorPublicProfileInclude,
} = require("../utils/tutor-profile.util");

const {
  buildUserFilters,
  buildTutorFilters,
  buildSubjectFilter,
  buildSort,
  buildUnifiedTutorSearch,
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
  const userWhere =
    buildUserFilters(filters);

  const tutorWhere =
    buildTutorFilters(filters);

  const subjectFilter =
    buildSubjectFilter(
      filters.subject
    );

  const unifiedSearch =
    buildUnifiedTutorSearch(
      filters.search
    );

  const order =
    buildSort(filters.sort_by);

  const {
    page,
    limit,
    offset,
  } = getPagination(
    filters.page,
    filters.limit
  );

  const {
    count,
    rows,
  } = await findTutors({
    where: {
      ...tutorWhere,
      ...unifiedSearch,
    },

    include: [
      {
        ...tutorSearchInclude[0],
        where: userWhere,
        required: false,
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
    subQuery: false,
    distinct: true,
  });

  return {
    tutors:
      formatTutorList(rows),

    pagination:
      getPaginationMeta(
        count,
        page,
        limit
      ),
  };
};

const getTutorById = async (
  tutor_profile_id
) => {
  const tutor =
    await findTutorById(
      tutor_profile_id,
      {
        include:
          tutorPublicProfileInclude,
      }
    );

  return formatTutorPublicProfile(
    tutor
  );
};

const getTutorAvailabilityByTutor =
  async (tutor_profile_id) => {
    const availability =
      await getTutorAvailability(
        tutor_profile_id,
        {
          where: {
            tutor_profile_id,
            is_active: true,
          },
        }
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