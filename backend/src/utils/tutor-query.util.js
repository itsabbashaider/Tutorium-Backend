const { Op } = require("sequelize");

const {
  TutorProfile,
  User,
  Subject,
  TutorSubject,
} = require("../models");

const getTutors = async (filters) => {
  const {
    subject,
    city,
    teaching_mode,
    min_price,
    max_price,
    min_rating,
    page = 1,
    limit = 10,
    sort_by = "top_rated",
  } = filters;

  const userWhere = {};
  const tutorWhere = {};

  // User filters
  if (city) {
    userWhere.city = {
      [Op.iLike]: `%${city}%`,
    };
  }

  // Tutor filters
  if (teaching_mode) {
    tutorWhere.teaching_mode = teaching_mode;
  }

  if (min_rating) {
    tutorWhere.avg_rating = {
      [Op.gte]: Number(min_rating),
    };
  }

  if (min_price || max_price) {
    tutorWhere.hourly_rate = {};

    if (min_price) {
      tutorWhere.hourly_rate[Op.gte] = Number(min_price);
    }

    if (max_price) {
      tutorWhere.hourly_rate[Op.lte] = Number(max_price);
    }
  }

  // Sorting
  let order = [];

  switch (sort_by) {
    case "lowest_price":
      order = [["hourly_rate", "ASC"]];
      break;

    case "highest_price":
      order = [["hourly_rate", "DESC"]];
      break;

    case "recently_added":
      order = [["created_at", "DESC"]];
      break;

    default:
      order = [["avg_rating", "DESC"]];
  }

  const offset = (page - 1) * limit;

  const tutors = await TutorProfile.findAndCountAll({
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
        required: !!subject,
        where: subject
          ? {
              subject_name: {
                [Op.iLike]: `%${subject}%`,
              },
            }
          : undefined,
      },
    ],

    order,

    limit: Number(limit),

    offset,
  });

  return {
    total: tutors.count,
    page: Number(page),
    limit: Number(limit),
    total_pages: Math.ceil(tutors.count / limit),
    tutors: tutors.rows,
  };
};

module.exports = {
  getTutors,
};