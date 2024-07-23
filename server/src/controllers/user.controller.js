import dotenv from "dotenv";
dotenv.config();
import SpotifyWebApi from "spotify-web-api-node";
import querystring from "querystring";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import { error } from "console";

// Utility function to generate a random string for state
const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Route to start Spotify authorization
const accountAuthorization = asyncHandler(async (req, res) => {
  const scopes = ["user-read-private", "user-read-email"];
  const state = generateRandomString(16);
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

// Route to handle Spotify callback
const callback = asyncHandler(async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  console.log("Authorization code:", code);

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
    return;
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body["access_token"];
    const refreshToken = data.body["refresh_token"];
    console.log(`The access token is: ${accessToken}`);
    console.log(`The access token expires in: ${data.body["expires_in"]}`);
    console.log(`The refresh token is: ${refreshToken}`);

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    const userInfo = await spotifyApi.getMe();
    console.log(`User information: ${JSON.stringify(userInfo.body)}`);

    // res.redirect(
    //   "/#" +
    //     querystring.stringify({
    //       access_token: accessToken,
    //       refresh_token: refreshToken,
    //     })
    // );

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(
        new responseHandler(
          200,
          { userInfo: userInfo.body, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (err) {
    console.log(
      "Something went wrong when retrieving the access token:",
      err.message
    );
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "invalid_token",
        })
    );
  }
});

export { accountAuthorization, callback };
