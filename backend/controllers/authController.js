const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/modUser");

const {
  genrateAccessToken,
  genrateRefreshToken,
} = require("../utils/generateTokens");

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const clearRefreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const toClientUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const toSession = (user) => ({
  accessToken: genrateAccessToken(user),
  user: toClientUser(user),
});

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const safeRole =
      role === "Vendor" ? "Vendor" : role === "Admin" ? "Admin" : "User";

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: safeRole,
    });

    res.status(201).json({
      message: "User created successfully",
      user: toClientUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", { email, password: "***" });

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const refreshToken = genrateRefreshToken(user);

    // role-specific refresh token - initialize if doesn't exist
    if (!user.refreshTokens) {
      user.refreshTokens = {};
    }
    user.refreshTokens[user.role] = refreshToken;

    console.log("Saving user with refreshToken...");
    await user.save();

    // role-specific cookie
    res.cookie(`refreshToken_${user.role}`, refreshToken, refreshCookieOptions);

    res.json(toSession(user));
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// REFRESH
const refreshAccessToken = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        message: "Role required",
      });
    }

    const token = req.cookies[`refreshToken_${role}`];

    if (!token) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens || user.refreshTokens[role] !== token) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const newRefreshToken = genrateRefreshToken(user);

    user.refreshTokens = {
      ...user.refreshTokens,
      [role]: newRefreshToken,
    };

    await user.save();

    res.cookie(`refreshToken_${role}`, newRefreshToken, refreshCookieOptions);

    res.json({
      accessToken: genrateAccessToken(user),
      user: toClientUser(user),
    });
  } catch {
    res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        message: "Role required",
      });
    }

    const token = req.cookies[`refreshToken_${role}`];

    if (token) {
      const user = await User.findOne({
        [`refreshTokens.${role}`]: token,
      });

      if (user) {
        user.refreshTokens = {
          ...user.refreshTokens,
          [role]: null,
        };

        await user.save();
      }
    }

    res.clearCookie(`refreshToken_${role}`, clearRefreshCookieOptions);

    res.json({
      message: "Logged out",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CURRENT USER
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  me,
};
