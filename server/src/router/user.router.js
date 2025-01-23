const { Router } = require("express");
const passport = require("passport");
require("../auth/spotify");
const { dashboard } = require("../controllers/user.controller");

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

router.get("/dashboard", dashboard);

module.exports = router;
