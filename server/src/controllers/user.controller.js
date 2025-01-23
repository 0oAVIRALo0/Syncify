const { asyncHandler } = require("../utils/index.js");

const dashboard = asyncHandler(async (req, res) => {
  res.send("Welcome User!");
});

const sendFriendRequest = asyncHandler(async (req, res) => {
  
});

module.exports = { dashboard };
