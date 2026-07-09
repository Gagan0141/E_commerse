const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token not found",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Token expired or invalid",
        });
      }

      req.user = decoded;

      next();
    }
  );
};

module.exports = {
  verifyAccessToken,
};