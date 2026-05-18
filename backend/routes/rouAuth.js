const express = require("express");

const {
  register,
  login,
  refreshAccessToken,
  logout,
  me,
} = require("../controllers/authController");

const { verifyAccessToken } = require("../middleware/verifyToken");

const router = express.Router();

// auth
router.post("/signup", register);

router.post("/login", login);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logout);

// current logged in user
router.get("/me", verifyAccessToken, me);

module.exports = router;
