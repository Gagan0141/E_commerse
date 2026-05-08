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
  const role = req.body?.role || req.query?.role;

  if (!role) {
    return res.status(400).json({
      message: "Role is required",
    });
  }

  const cookieName = getCookieName(role);

  if (!cookieName) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  const token = req.cookies[cookieName];

  if (!token) {
    return res.status(401).json({
      message: `${role} not logged in`,
    });
  }

  try {
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
