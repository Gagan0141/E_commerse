const jwt = require("jsonwebtoken");

const getCookieName = (role) => {
  switch (role) {
    case "User":
      return "userToken";
    case "Vendor":
      return "vendorToken";
    case "Admin":
      return "adminToken";
    default:
      return null;
  }
};

const vertoken = (req, res, next) => {
  try {
    // Try to get token from multiple sources in order of preference:
    // 1. Authorization header (Bearer token)
    // 2. Role-specific cookies (userToken, vendorToken, adminToken)
    
    let token = null;
    let role = req.body?.role || req.query?.role;

    // First, try Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // If no Authorization header, try role-specific cookies
    if (!token && role) {
      const cookieName = getCookieName(role);
      if (cookieName) {
        token = req.cookies[cookieName];
      }
    }

    // If still no token, try all role cookies
    if (!token) {
      const roles = ["User", "Vendor", "Admin"];
      for (const r of roles) {
        const cookieName = getCookieName(r);
        if (req.cookies[cookieName]) {
          token = req.cookies[cookieName];
          role = r;
          break;
        }
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = { vertoken };
