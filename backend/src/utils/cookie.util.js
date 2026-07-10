const env = require("../config/env");

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.app.nodeEnv === "production",
  sameSite: "strict",
  maxAge:
    env.security.cookieExpiresIn *
    24 *
    60 *
    60 *
    1000,
});

module.exports = {
  getCookieOptions,
};