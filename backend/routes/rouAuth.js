const express = require("express");

const {
  register,
  login,
  refreshToken,
  logout,
  me,
} = require("../controllers/authController");

const {
  vertoken,
} = require("../middleware/verifyToken");

const router = express.Router();

// auth
router.post("/signup", register);

router.post("/login", login);

router.post("/refresh", refreshToken);

router.post("/logout", logout);

// current logged in user
router.get("/me", vertoken, me);

module.exports = router;
