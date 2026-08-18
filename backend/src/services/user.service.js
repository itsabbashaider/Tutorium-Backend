const { User } = require("../models");

const {
  getUserResponse,
  getProfileUpdateData,
} = require("../utils/user.util");

const {
  NotFoundError,
} = require("../errors/app.error");

const getProfile = async (user_id) => {
  const user = await User.findByPk(user_id);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return getUserResponse(user);
};

const updateProfile = async (user_id, data) => {
  const user = await User.findByPk(user_id);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const updateData = getProfileUpdateData(data);

  await user.update(updateData);

  return getUserResponse(user);
};

module.exports = {
  getProfile,
  updateProfile,
};