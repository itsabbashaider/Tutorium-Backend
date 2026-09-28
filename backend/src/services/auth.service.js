const bcrypt = require("bcrypt");

const { sequelize, User, StudentProfile, TutorProfile } = require("../models");

const { Op } = require("sequelize");

const env = require("../config/env");

const { generateToken } = require("../utils/jwt.util");
const { getUserResponse } = require("../utils/user.util");

const { ConflictError, UnauthorizedError } = require("../errors/app.error");

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

  const hashedPassword = await bcrypt.hash(password, env.security.saltRounds);

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
      { transaction },
    );

    if (role === "STUDENT") {
      await StudentProfile.create({ user_id: user.user_id }, { transaction });
    } else if (role === "TUTOR") {
      await TutorProfile.create(
        {
          user_id: user.user_id,
          professional_bio: "",
          hourly_rate: 0,
          teaching_mode: "ONLINE",
          is_available: false,
          avg_rating: 0,
          total_completed_sessions: 0,
          total_earnings: 0,
        },
        { transaction },
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

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

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

const googleAuth = async (code) => {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    grant_type: "authorization_code",
  };

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(values),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok)
    throw new UnauthorizedError("Failed to authenticate with Google.");

  const userResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenData.access_token}`,
  );
  const googleUser = await userResponse.json();

  // Find user by email
  let user = await User.findOne({
    where: { email: { [Op.iLike]: googleUser.email } },
  });

  let isNewUser = false;

  if (!user) {
    // New Google user: set role to null to trigger the modal
    isNewUser = true;
    user = await User.create({
      email: googleUser.email,
      full_name: googleUser.name,
      google_id: googleUser.id,
      password: "GOOGLE_OAUTH_USER_PLACEHOLDER",
      role: null,
    });
  } else if (!user.google_id) {
    // Link existing manual account to Google if not linked yet
    user.google_id = googleUser.id;
    await user.save();
  }

  const token = generateToken({
    user_id: user.user_id,
    role: user.role,
  });

  return {
    token,
    user: getUserResponse(user),
    isNewUser: isNewUser || !user.role,
  };
};

const logout = () => {
  return true;
};

const getMe = async (user_id) => {
  const user = await User.findByPk(user_id);

  return getUserResponse(user);
};

module.exports = {
  register,
  login,
  googleAuth,
  logout,
  getMe,
};
