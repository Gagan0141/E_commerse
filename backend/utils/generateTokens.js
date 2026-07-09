const jwt = require("jsonwebtoken");

// Create payload for JWT
const createPayload = (user) => ({
  id: user._id || user.id,
  role: user.role,
});

// ---------------------------
// Access Token
// ---------------------------

const generateAccessToken = (user) => {
  return jwt.sign(
    createPayload(user),
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// ---------------------------
// Refresh Token
// ---------------------------

const generateRefreshToken = (user) => {
  return jwt.sign(
    createPayload(user),
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};