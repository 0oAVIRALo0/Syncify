const { Router } = require("express");
const passport = require("passport");
require("../auth/spotify");

const router = new Router();

router.get(
  "/login",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
    session: false,
  })
);

router.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: "/api/v1/users/login",
    successRedirect: "/api/v1/users/dashboard",
    session: false,
  })
);

module.exports = router;
