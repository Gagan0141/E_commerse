const jwt = require("jsonwebtoken");

const vertoken = (req, res, next) => {
  try {
    let token = null;

    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    req.user = decoded;

    next();
  } catch (error) {
    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = { vertoken };