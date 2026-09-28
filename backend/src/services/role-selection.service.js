const { sequelize, User, StudentProfile, TutorProfile } = require("../models");
const { generateToken } = require("../utils/jwt.util");
const { getUserResponse } = require("../utils/user.util");
const { NotFoundError } = require("../errors/app.error");

const updateRole = async (user_id, role) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(user_id, { transaction });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    user.role = role;
    await user.save({ transaction });

    if (role === "STUDENT") {
      await StudentProfile.findOrCreate({
        where: { user_id: user.user_id },
        defaults: { user_id: user.user_id },
        transaction,
      });
    } else if (role === "TUTOR") {
      await TutorProfile.findOrCreate({
        where: { user_id: user.user_id },
        defaults: {
          user_id: user.user_id,
          professional_bio: "",
          hourly_rate: 0,
          teaching_mode: "ONLINE",
          is_available: false,
          avg_rating: 0,
          total_completed_sessions: 0,
          total_earnings: 0,
        },
        transaction,
      });
    }

    await transaction.commit();

    // Generate fresh JWT token reflecting the newly assigned role
    const newToken = generateToken({
      user_id: user.user_id,
      role: user.role,
    });

    return {
      token: newToken,
      user: getUserResponse(user),
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  updateRole,
};