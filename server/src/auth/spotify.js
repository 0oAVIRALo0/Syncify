const SpotifyStrategy = require("passport-spotify").Strategy;
const passport = require("passport");
const prisma = require("../db/db.config");

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URI,
    },
    async function (accessToken, refreshToken, expires_in, profile, done) {
      try {
        let user = await prisma.user.findUnique({
          where: {
            spotifyId: profile.id,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              spotifyId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value,
            },
          });

          await prisma.profile.create({
            data: {
              userId: user.id,
              spotifyFollowers: profile.followers.total, // Adjusted to use `profile.followers.total`
              location: profile.country,
            },
          });

          await prisma.tokens.create({
            data: {
              userId: user.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              expiresAt: Date(expires_in * 1000),
            },
          });
        } else {
          // If the user already exists, update their tokens
          await prisma.tokens.upsert({
            where: {
              userId: user.id,
            },
            update: {
              accessToken: accessToken,
              refreshToken: refreshToken,
              expiresAt: Date(expires_in * 1000),
            },
            // create: {
            //   userId: user.id,
            //   accessToken: accessToken,
            //   refreshToken: refreshToken,
            //   expiresAt: Date.now() + expires_in * 1000,
            // },
          });
        }

        // Return the user object after authentication is successful
        return done(null, user);
      } catch (error) {
        console.error("Error during Spotify authentication:", error);
        return done(error, null);
      }
    }
  )
);
