const { asyncHandler } = require("../utils/index.js");

const dashboard = asyncHandler(async (req, res) => {
  res.send("Welcome User!");
});

module.exports = { dashboard };
