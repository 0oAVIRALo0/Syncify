const jwt = require("jsonwebtoken");
const { accessTokenSecret, refreshTokenSecret } = require("../config/auth");

const getAuthenticationToken = (user, res) => {
  const accessToken = jwt.sign(
    {
      email: user.email,
      displayName: user.displayName,
      id: user.id,
    },
    accessTokenSecret,
    { expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    {
      email: user.email,
      displayName: user.displayName,
      id: user.id,
    },
    refreshTokenSecret,
    { expiresIn: "7d" }
  );

  const refreshTokenCookiePart = refreshToken.split(".")[2];
  const accessTokenCookiePart = accessToken.split(".")[2];

  const refreshTokenHeaderPart = refreshToken.split(".").slice(0, 2).join(".");
  const accessTokenHeaderPart = accessToken.split(".").slice(0, 2).join(".");

  res.cookie("syncify-refresh-token", refreshTokenCookiePart, {
    httpOnly: true,
    secure: true,
    domain: process.env.NODE_ENV === "production" ? cookieDomain : "localhost",
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
    expires: new Date(Date.now() + 7 * 86400000), // valid for 7 days
  });

  res.cookie("syncify-access-token", accessTokenCookiePart, {
    httpOnly: true,
    secure: true,
    domain: process.env.NODE_ENV === "production" ? cookieDomain : "localhost",
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
    expires: new Date(Date.now() + 2 * 60000), // valid for 20 minutes
  });

  return {
    accessToken: accessTokenHeaderPart,
    refreshToken: refreshTokenHeaderPart,
  };
};

module.exports = { getAuthenticationToken };
