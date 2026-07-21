const { Op } = require("sequelize");

const buildUserFilters = (filters) => {
  const where = {};

  if (filters.city) {
    where.city = {
      [Op.iLike]: `%${filters.city}%`,
    };
  }

  return where;
};

const buildTutorFilters = (filters) => {
  const where = {}

  if (filters.teaching_mode) {
    where.teaching_mode = filters.teaching_mode;
  }

  if (filters.min_rating) {
    where.avg_rating = {
      [Op.gte]: Number(filters.min_rating),
    };
  }

  if (filters.min_price || filters.max_price) {
    where.hourly_rate = {};

    if (filters.min_price) {
      where.hourly_rate[Op.gte] = Number(filters.min_price);
    }

    if (filters.max_price) {
      where.hourly_rate[Op.lte] = Number(filters.max_price);
    }
  }

  return where;

}

const buildSubjectFilter = (subject) => {
  if (!subject) {
    return {
      where: undefined,
      required: false,
    };
  }

  return {
    where: {
      subject_name: {
        [Op.iLike]: `%${subject}%`,
      },
    },
    required: true,
  };
};

const buildSort = (sort_by = "top_rated") => {
  switch (sort_by) {
    case "lowest_price":
      return [["hourly_rate", "ASC"]];

    case "highest_price":
      return [["hourly_rate", "DESC"]];

    case "recently_added":
      return [["created_at", "DESC"]];

    case "top_rated":
    default:
      return [["avg_rating", "DESC"]];
  }
};


module.exports = {
  buildUserFilters,
  buildTutorFilters,
  buildSubjectFilter,
  buildSort,
}