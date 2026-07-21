const {
  TutorProfile,
  User,
  Subject,
  Review,
  Booking,
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
      "phone_number",
      "timezone",
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
  },
];

const tutorSearchInclude = [
  {
    model: User,
    as: "user",
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
  },
];


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

const findTutorProfile = async (user_id, options = {}) => {
  const tutorProfile = await TutorProfile.findOne({
    where: { user_id },
    ...options,
  });

  if (!tutorProfile) {
    throw new NotFoundError("Tutor profile not found.");
  }

  return tutorProfile;
};


const updateTutorCompletedStats = async (
  tutorProfile,
  booked_hourly_rate
) => {
  await tutorProfile.increment({
    total_completed_sessions: 1,
    total_earnings: Number(booked_hourly_rate),
  });

  await tutorProfile.reload();

  return tutorProfile;
};


const updateTutorRatingStats = async (
  tutorProfile
) => {
  const reviews = await Review.findAll({
    include: [
      {
        model: Booking,
        as: "booking",
        where: {
          tutor_profile_id:
            tutorProfile.tutor_profile_id,
        },
        attributes: [],
      },
    ],
    attributes: ["rating"],
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce(
          (sum, review) =>
            sum + review.rating,
          0
        ) / totalReviews;

  await tutorProfile.update({
    avg_rating:
      Number(averageRating.toFixed(2)),
  });

  return tutorProfile;
};

const formatTutor = (tutor) => ({
  tutor_profile_id: tutor.tutor_profile_id,

  full_name: tutor.user.full_name,
  city: tutor.user.city,

  professional_bio: tutor.professional_bio,
  hourly_rate: Number(tutor.hourly_rate),
  teaching_mode: tutor.teaching_mode,

  avg_rating: Number(tutor.avg_rating),

  subjects: tutor.subjects.map((subject) => ({
    subject_id: subject.subject_id,
    subject_name: subject.subject_name,
  })),
});

const formatTutorList = (tutors) => {
  return tutors.map(formatTutor);
};

const findTutors = async (options = {}) => {
  return await TutorProfile.findAndCountAll({
    include: tutorSearchInclude,
    distinct: true,

    ...options,
  });
};

const findTutorById = async (
  tutor_profile_id,
  options = {}
) => {
  const tutor = await TutorProfile.findByPk(
    tutor_profile_id,
    {
      ...options,
    }
  );

  if (!tutor) {
    throw new NotFoundError(
      "Tutor not found."
    );
  }

  return tutor;
};

const findTutorProfileById = async (tutor_profile_id) => {
  const tutorProfile = await TutorProfile.findByPk(tutor_profile_id);

  if (!tutorProfile) {
    throw new NotFoundError("Tutor profile not found.");
  }

  return tutorProfile;
};

module.exports = {
  tutorProfileInclude,
  tutorSearchInclude,

  formatTutorProfile,
  formatTutor,
  formatTutorList,

  findTutorProfile,
  findTutorProfileById,
  findTutorById,
  findTutors,

  updateTutorCompletedStats,
  updateTutorRatingStats,
};