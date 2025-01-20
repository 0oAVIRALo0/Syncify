// import dotenv from "dotenv";
// dotenv.config();
// import SpotifyWebApi from "spotify-web-api-node";
// import querystring from "querystring";
// import { asyncHandler, responseHandler, errorHandler, generateRandomString } from "../utils/index.js";
// import prisma from "../../DB/db.config.js";
// import { CLIENT_RENEG_LIMIT } from "tls";

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.SPOTIFY_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//   redirectUri: process.env.SPOTIFY_REDIRECT_URI,
// });

// // Route to start Spotify authorization
// const accountAuthorization = asyncHandler(async (req, res) => {
//   const scopes = ["user-read-private", "user-read-email"];
//   const state = generateRandomString(16);
//   // console.log("State:", state);
//   const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
//   // console.log("Authorize URL:", authorizeURL);
//   res.redirect(authorizeURL);
// });

// // Route to handle Spotify callback
// const dashboard = asyncHandler(async (req, res) => {
//   const code = req.query.code || null;
//   const state = req.query.state || null;

//   // console.log("Authorization code:", code);

//   if (state === null) {
//     res.redirect(
//       "/#" +
//         querystring.stringify({
//           error: "state_mismatch",
//         })
//     );
//     return;
//   }

//   const data = await spotifyApi.authorizationCodeGrant(code);
//   const access_Token = data.body["access_token"];
//   const refresh_Token = data.body["refresh_token"];
//   console.log("Data:", data.body);
//   // console.log(`The access token is: ${access_Token}`);
//   // console.log(`The access token expires in: ${data.body["expires_in"]}`);
//   // console.log(`The refresh token is: ${refresh_Token}`);

//   spotifyApi.setAccessToken(access_Token);
//   spotifyApi.setRefreshToken(refresh_Token);

//   const info = await spotifyApi.getMe();
//   const userInfo = info.body;
//   // console.log(JSON.stringify(info));

//   const display_name = userInfo.display_name;
//   // console.log("Display name:", display_name);
//   const avatarUrl = userInfo.images[1]?.url;
//   // console.log("Avatar URL:", avatarUrl);
//   const email = userInfo["email"];
//   // console.log("Email:", email);
//   var isPremium = false;
//   const product = userInfo.product;
//   if (product === "premium") {
//     isPremium = true;
//   }
//   // console.log("Is premium:", isPremium);

//   const findUser = await prisma.user.findUnique({
//     where: {
//       email: email,
//     },
//   });

//   if (findUser) {
//     throw new errorHandler(409, "User with email already exists.");
//   }

//   const newUser = await prisma.user.create({
//     data: {
//       display_name: display_name,
//       avatarUrl: avatarUrl,
//       email: email,
//       isPremium: isPremium,
//       accessToken: access_Token,
//       refreshToken: refresh_Token,
//     },
//   });

//   // res.redirect(
//   //   "/#" +
//   //     querystring.stringify({
//   //       access_token: access_Token,
//   //       refresh_token: refresh_Token,
//   //     })
//   // );

//   return res
//     .status(200)
//     .json(
//       new responseHandler(
//         200,
//         { data: newUser, accessToken: access_Token, refreshToken: refresh_Token },
//         "User logged in successfully"
//       )
//     );
// });

// const getArtists = asyncHandler(async (req, res) => {   
//   const { accessToken } = req.body;
//   console.log("Access token:", accessToken);
//   spotifyApi.setAccessToken(accessToken);
//   const data = await spotifyApi.getMyTopArtists();
//   const artists = data.body.items;
//   console.log("Artists:", artists);
//   return res
//     .status(200)
//     .json(
//       new responseHandler(
//         200,
//         { data: artists },
//         "Top artists fetched successfully"
//       )
//     );
// });

// export { accountAuthorization, dashboard, getArtists };

