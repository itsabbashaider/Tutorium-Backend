const bcrypt = require("bcrypt");

const { sequelize, User, StudentProfile, TutorProfile } = require("../models");

const { Op } = require("sequelize"); 

const env = require("../config/env");
const jwt = require("jsonwebtoken");

const { generateToken } = require("../utils/jwt.util");
const { getUserResponse } = require("../utils/user.util");

const { ConflictError, UnauthorizedError, NotFoundError } = require("../errors/app.error"); 

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
    env.security.saltRounds
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

const googleAuth = async (code) => {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    grant_type: 'authorization_code',
  };

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(values),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) throw new UnauthorizedError('Failed to authenticate with Google.');

  const userResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenData.access_token}`
  );
  const googleUser = await userResponse.json();

  // Find user by email
  let user = await User.findOne({ 
    where: { email: { [Op.iLike]: googleUser.email } } 
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

  return { token, user: getUserResponse(user), isNewUser: isNewUser || !user.role };
};

const logout = () => {
  return true;
}

const getMe = async (user_id) => {
  const user = await User.findByPk(user_id);

  return getUserResponse(user);
};

const setupSecurityQA = async (userId, { security_questions }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError("User not found.");

  if (!security_questions || !Array.isArray(security_questions) || security_questions.length < 2) {
    throw new BadRequestError("At least 2 security questions and answers are required.");
  }

  const hash1 = await bcrypt.hash(security_questions[0].answer.trim().toLowerCase(), env.security.saltRounds);
  const hash2 = await bcrypt.hash(security_questions[1].answer.trim().toLowerCase(), env.security.saltRounds);

  user.security_question_1 = security_questions[0].question;
  user.security_answer_hash_1 = hash1;
  user.security_question_2 = security_questions[1].question;
  user.security_answer_hash_2 = hash2;

  await user.save();

  return { message: "Security backup updated successfully." };
};

const getSecurityQuestion = async ({ email }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.security_question_1 || !user.security_question_2) {
    throw new NotFoundError("No security questions configured for this account or email not found.");
  }

  return {
    security_questions: [
      { question: user.security_question_1 },
      { question: user.security_question_2 },
    ],
  };
};

const verifySecurityAnswer = async ({ email, security_answers }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.security_answer_hash_1 || !user.security_answer_hash_2) {
    throw new UnauthorizedError("Invalid recovery request.");
  }

  if (!security_answers || !Array.isArray(security_answers) || security_answers.length < 2) {
    throw new UnauthorizedError("Security answers are required.");
  }

  const isMatch1 = await bcrypt.compare(security_answers[0].trim().toLowerCase(), user.security_answer_hash_1);
  const isMatch2 = await bcrypt.compare(security_answers[1].trim().toLowerCase(), user.security_answer_hash_2);

  if (!isMatch1 || !isMatch2) {
    throw new UnauthorizedError("Incorrect security answers.");
  }

  const resetToken = jwt.sign(
    { user_id: user.user_id, purpose: "password_reset" },
    env.jwt.secret,
    { expiresIn: "5m" }
  );

  return { resetToken, message: "Security answers verified successfully." };
};

// 4. Forgot Password Step 3: Reset Password using Token
const resetPasswordWithQA = async ({ resetToken, newPassword }) => {
  let decoded;
  try {
    decoded = jwt.verify(resetToken, env.jwt.secret);
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired password reset session.");
  }

  if (decoded.purpose !== "password_reset") {
    throw new UnauthorizedError("Invalid token purpose.");
  }

  const user = await User.findByPk(decoded.user_id);
  if (!user) throw new NotFoundError("User not found.");

  const hashedPassword = await bcrypt.hash(newPassword, env.security.saltRounds);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password has been successfully reset." };
};

const changePassword = async (userId, { current_password, new_password }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError("User not found.");

  const isMatch = await bcrypt.compare(current_password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Incorrect current password.");
  }

  const hashedPassword = await bcrypt.hash(new_password, env.security.saltRounds);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password changed successfully." };
};

module.exports = {
  register,
  login,
  googleAuth,
  logout,
  getMe,
  resetPasswordWithQA,
  setupSecurityQA,
  getSecurityQuestion,
  verifySecurityAnswer,
  changePassword,
};