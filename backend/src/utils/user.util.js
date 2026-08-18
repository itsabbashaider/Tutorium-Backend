const getUserResponse = (user) => {
  if (!user) return null;

  return {
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    city: user.city,
    phone_number: user.phone_number,
    role: user.role,
    timezone: user.timezone,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

const getProfileUpdateData = (data) => {
  const allowedFields = [
    "full_name",
    "city",
    "phone_number",
    "timezone",
  ];

  return Object.fromEntries(
    Object.entries(data).filter(([key]) =>
      allowedFields.includes(key)
    )
  );
};

module.exports = {
  getUserResponse,
  getProfileUpdateData,
};