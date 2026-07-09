const express = require("express");
const router = express.Router();

const { verifyAccessToken } = require("../middleware/verifyToken");
const { authRoles } = require("../middleware/authRole");

const {
  getDashboard,
} = require("../controllers/adminDashboardController");

router.get(
  "/dashboard",
  verifyAccessToken,
  authRoles("Admin"),
  getDashboard
);

module.exports = router;