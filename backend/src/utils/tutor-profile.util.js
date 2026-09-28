const { fn, col, literal } = require("sequelize");

const {
  TutorProfile,
  User,
  Subject,
  Review,
  Booking,
  TutorAvailability,
} = require("../models");

const { NotFoundError } = require("../errors/app.error");

const tutorProfileInclude = [
  {
    model: User,
    as: "user",
    attributes: [
      "user_id",
      "full_name",
      "email",
      "city",
      "avatar_url",
      "phone_number",
      "timezone",
    ],
  },
  {
    model: Subject,
    as: "subjects",
    attributes: ["subject_id", "subject_name"],
    through: {
      attributes: [],
    },
  },
];

const tutorPublicProfileInclude = [
  {
    model: User,
    as: "user",
    attributes: ["user_id", "full_name", "city", "avatar_url"],
  },
  {
    model: Subject,
    as: "subjects",
    attributes: ["subject_id", "subject_name"],
    through: {
      attributes: [],
    },
  },
];

const tutorSearchInclude = [
  {
    model: User,
    as: "user",
    attributes: ["user_id", "full_name", "city", "avatar_url"],
  },
  {
    model: Subject,
    as: "subjects",
    attributes: ["subject_id", "subject_name"],
    through: {
      attributes: [],
    },
  },
];

const getComputedField = (record, key) => {
  return typeof record?.get === "function" ? record.get(key) : record?.[key];
};

const formatTutorProfile = (profile) => {
  return {
    tutor_profile_id: profile.tutor_profile_id,
    professional_bio: profile.professional_bio,
    hourly_rate: Number(profile.hourly_rate),
    teaching_mode: profile.teaching_mode,
    is_available: profile.is_available,
    avg_rating: Number(profile.avg_rating),
    total_completed_sessions: profile.total_completed_sessions,
    total_earnings: Number(profile.total_earnings),
    user: profile.user
      ? {
          user_id: profile.user.user_id,
          full_name: profile.user.full_name,
          email: profile.user.email,
          city: profile.user.city,
          avatar_url: profile.user.avatar_url || null,
          phone_number: profile.user.phone_number,
          timezone: profile.user.timezone,
        }
      : null,
    subjects: profile.subjects
      ? profile.subjects.map((subject) => ({
          subject_id: subject.subject_id,
          subject_name: subject.subject_name,
        }))
      : [],
  };
};

const formatTutorPublicProfile = (profile) => {
  return {
    tutor_profile_id: profile.tutor_profile_id,
    full_name: profile.user?.full_name || null,
    city: profile.user?.city || null,
    avatar_url: profile.user?.avatar_url || null,
    professional_bio: profile.professional_bio,
    hourly_rate: Number(profile.hourly_rate),
    teaching_mode: profile.teaching_mode,
    is_available: profile.is_available,
    is_bookable: Boolean(getComputedField(profile, "is_bookable")),
    available_slot_count: Number(
      getComputedField(profile, "available_slot_count") ?? 0,
    ),
    avg_rating: Number(profile.avg_rating),
    total_completed_sessions: profile.total_completed_sessions,
    subjects: profile.subjects
      ? profile.subjects.map((subject) => ({
          subject_id: subject.subject_id,
          subject_name: subject.subject_name,
        }))
      : [],
  };
};

const formatTutor = (tutor) => ({
  tutor_profile_id: tutor.tutor_profile_id,
  full_name: tutor.user?.full_name || null,
  city: tutor.user?.city || null,
  avatar_url: tutor.user?.avatar_url || null,
  professional_bio: tutor.professional_bio,
  hourly_rate: Number(tutor.hourly_rate),
  teaching_mode: tutor.teaching_mode,
  is_available: tutor.is_available,
  is_bookable: Boolean(getComputedField(tutor, "is_bookable")),
  available_slot_count: Number(
    getComputedField(tutor, "available_slot_count") ?? 0,
  ),
  avg_rating: Number(tutor.avg_rating),
  subjects: tutor.subjects
    ? tutor.subjects.map((subject) => ({
        subject_id: subject.subject_id,
        subject_name: subject.subject_name,
      }))
    : [],
});

const formatTutorList = (tutors) => {
  return tutors.map(formatTutor);
};

const findTutorProfile = async (user_id, options = {}) => {
  const tutorProfile = await TutorProfile.findOne({
    where: {
      user_id,
    },
    ...options,
  });

  if (!tutorProfile) {
    throw new NotFoundError("Tutor profile not found.");
  }

  return tutorProfile;
};

const findTutorProfileById = async (tutor_profile_id) => {
  const tutorProfile = await TutorProfile.findByPk(tutor_profile_id);

  if (!tutorProfile) {
    throw new NotFoundError("Tutor profile not found.");
  }

  return tutorProfile;
};

const findTutorById = async (tutor_profile_id, options = {}) => {
  const tutor = await TutorProfile.findByPk(tutor_profile_id, {
    include: tutorPublicProfileInclude,
    ...options,
  });

  if (!tutor) {
    throw new NotFoundError("Tutor not found.");
  }

  const activeSlotCount = await TutorAvailability.count({
    where: {
      tutor_profile_id,
      is_active: true,
    },
  });

  tutor.setDataValue("available_slot_count", activeSlotCount);

  tutor.setDataValue(
    "is_bookable",
    Boolean(tutor.is_available && activeSlotCount > 0),
  );

  return tutor;
};

const updateTutorCompletedStats = async (tutorProfile, booked_hourly_rate) => {
  await tutorProfile.increment({
    total_completed_sessions: 1,
    total_earnings: Number(booked_hourly_rate),
  });

  await tutorProfile.reload();

  return tutorProfile;
};

const updateTutorRatingStats = async (tutorProfile) => {
  const result = await Review.findOne({
    attributes: [
      [fn("AVG", col("rating")), "average_rating"],
      [fn("COUNT", col("review_id")), "total_reviews"],
    ],
    include: [
      {
        model: Booking,
        as: "booking",
        where: {
          tutor_profile_id: tutorProfile.tutor_profile_id,
        },
        attributes: [],
      },
    ],
    raw: true,
  });

  const averageRating = Number(result?.average_rating ?? 0);

  await tutorProfile.update({
    avg_rating: Number(averageRating.toFixed(2)),
  });

  return tutorProfile;
};

const findTutors = async (options = {}) => {
  return TutorProfile.findAndCountAll({
    attributes: {
      include: [
        [
          literal(`(
            SELECT COUNT(*)
            FROM tutor_availability AS availability
            WHERE availability.tutor_profile_id = "TutorProfile"."tutor_profile_id"
              AND availability.is_active = true
          )`),
          "available_slot_count",
        ],
        [
          literal(`(
            "TutorProfile"."is_available" = true
            AND EXISTS (
              SELECT 1
              FROM tutor_availability AS availability
              WHERE availability.tutor_profile_id = "TutorProfile"."tutor_profile_id"
                AND availability.is_active = true
            )
          )`),
          "is_bookable",
        ],
      ],
    },
    include: tutorSearchInclude,
    distinct: true,
    ...options,
  });
};

module.exports = {
  tutorProfileInclude,
  tutorPublicProfileInclude,
  tutorSearchInclude,
  formatTutorProfile,
  formatTutorPublicProfile,
  formatTutor,
  formatTutorList,
  findTutorProfile,
  findTutorProfileById,
  findTutorById,
  findTutors,
  updateTutorCompletedStats,
  updateTutorRatingStats,
};
