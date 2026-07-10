const getUserResponse = (user) => ({
  user_id: user.user_id,
  full_name: user.full_name,
  email: user.email,
  city: user.city,
  phone_number: user.phone_number,
  role: user.role,
  timezone: user.timezone,
});

module.exports = {
  getUserResponse,
};