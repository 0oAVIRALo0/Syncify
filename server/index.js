import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import SpotifyWebApi from "spotify-web-api-node";
import querystring from "querystring";

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server);

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Route to start Spotify authorization
app.get("/login", (req, res) => {
  const scopes = ["user-read-private", "user-read-email"];
  const state = generateRandomString(16);
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

// Route to handle Spotify callback
app.get("/callback", (req, res) => {
  const code = req.query.code || null;
  console.log("Authorization code:", code); // Added logging
  const state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    spotifyApi
      .authorizationCodeGrant(code)
      .then(
        function (data) {
          console.log("The access token expires in " + data.body["expires_in"]);
          console.log("The access token is " + data.body["access_token"]);
          console.log("The refresh token is " + data.body["refresh_token"]);

          // Save the access token and refresh token for future use
          spotifyApi.setAccessToken(data.body["access_token"]);
          spotifyApi.setRefreshToken(data.body["refresh_token"]);

          res.redirect(
            "/#" +
              querystring.stringify({
                access_token: data.body["access_token"],
                refresh_token: data.body["refresh_token"],
              })
          );

          return spotifyApi.getMe();
        },
        function (err) {
          console.log(
            "Something went wrong when retrieving the access token",
            err.message
          );
          res.redirect(
            "/#" +
              querystring.stringify({
                error: "invalid_token",
              })
          );
        }
      )
      .then(function (data) {
        console.log(data);
        // console.log("Retrieved data for " + data.body["display_name"]);

        // console.log("Email is " + data.body.email);

        // console.log("Image URL is " + data.body.images[0].url);

        // console.log("This user has a " + data.body.product + " account");
      })
      .catch(function (err) {
        console.log("Something went wrong:", err.message);
      });
  }
});

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

io.on("connection", (socket) => {
  console.log(`User connected with socketId: ${socket.id}`);

  socket.on("client", (args) => {
    console.log(args);
    socket.emit("client", "Welcome!");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
