require("dotenv");

module.exports = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  },
  tokenTypes: {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    emailVerificationToken: "email-verification-token",
    resetPasswordToken: "reset-password-token",
  },
  frontendBaseUrl: process.env.FRONTEND_URL,
  backendBaseUrl: process.env.BACKEND_URL,
  cookieDomain: "syncify.earth",
};
