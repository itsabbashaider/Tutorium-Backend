const bcrypt = require("bcrypt");

const { sequelize, User, StudentProfile, TutorProfile } = require("../models");

const env = require("../config/env");

const { generateToken } = require("../utils/jwt.util");
const { getUserResponse } = require("../utils/user.util");

const ConflictError = require("../errors/conflict.error");
const UnauthorizedError = require("../errors/unauthorized.error");

const register = async ({
  full_name,
  email,
  password,
  city,
  phone_number,
  role,
  timezone,
}) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("Email is already registered.");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    env.security.bcryptSaltRounds
  );

  const transaction = await sequelize.transaction();

  try {
    const user = await User.create(
      {
        full_name,
        email,
        password: hashedPassword,
        city,
        phone_number,
        role,
        timezone,
      },
      { transaction }
    );

    if (role === "STUDENT") {
      await StudentProfile.create(
        { user_id: user.user_id },
        { transaction }
      );
    }

    else if (role === "TUTOR") {
      await TutorProfile.create(
        { user_id: user.user_id },
        { transaction }
      );
    }

    await transaction.commit();

    return getUserResponse(user);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const login = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const token = generateToken({
    user_id: user.user_id,
    role: user.role,
  });

  return {
    token,
    user: getUserResponse(user),
  };
};

const logout = () => {
  return true;
}

const getMe = async (user_id) => {
  const user = await User.findByPk(user_id);

  return getUserResponse(user);
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};