import dotenv from "dotenv";
dotenv.config();
import SpotifyWebApi from "spotify-web-api-node";
import querystring from "querystring";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import prisma from "../../DB/db.config.js";

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

  // console.log("Authorization code:", code);

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
    return;
  }

  const data = await spotifyApi.authorizationCodeGrant(code);
  const access_Token = data.body["access_token"];
  const refresh_Token = data.body["refresh_token"];
  // console.log(`The access token is: ${access_Token}`);
  // console.log(`The access token expires in: ${data.body["expires_in"]}`);
  // console.log(`The refresh token is: ${refresh_Token}`);

  spotifyApi.setAccessToken(access_Token);
  spotifyApi.setRefreshToken(refresh_Token);

  const info = await spotifyApi.getMe();
  const userInfo = info.body;
  // console.log(JSON.stringify(info));

  const display_name = userInfo.display_name;
  console.log(display_name);
  const avatarUrl = userInfo.images[1].url;
  console.log(avatarUrl);
  const email = userInfo["email"];
  console.log(email);
  var isPremium = false;
  const product = userInfo.product;
  if (product === "premium") {
    isPremium = true;
  }
  console.log(isPremium);

  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (findUser) {
    throw new errorHandler(409, "User with email already exists.");
  }

  const newUser = await prisma.user.create({
    data: {
      display_name: display_name,
      avatarUrl: avatarUrl,
      email: email,
      isPremium: isPremium,
      accessToken: access_Token,
      refreshToken: refresh_Token,
    },
  });

  // res.redirect(
  //   "/#" +
  //     querystring.stringify({
  //       access_token: accessToken,
  //       refresh_token: refreshToken,
  //     })
  // );

  return res
    .status(200)
    .json(
      new responseHandler(
        200,
        { data: newUser, access_Token, refresh_Token },
        "User logged in successfully"
      )
    );
});

export { accountAuthorization, callback };
