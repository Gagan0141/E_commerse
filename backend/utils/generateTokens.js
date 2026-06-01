const jwt = require("jsonwebtoken");

const genrateRefreshToken = (payload) => {
  // Ensure payload is a plain object with only necessary fields
  const tokenPayload = payload._id ? { id: payload._id, role: payload.role } : payload;
  return jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const genrateAccessToken = (payload) => {
  // Ensure payload is a plain object with only necessary fields
  const tokenPayload = payload._id ? { id: payload._id, role: payload.role } : payload;
  return jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

module.exports = { genrateRefreshToken, genrateAccessToken };
