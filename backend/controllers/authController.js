const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/modUser");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const allowedRoles = ["User", "Vendor", "Admin"];

const getRefreshCookieName = (role) => `refreshToken_${role}`;

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
  accessToken: generateAccessToken(user),
  user: toClientUser(user),
});

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const safeRole = role === "Vendor" ? "Vendor" : "User";

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
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

    // if (!allowedRoles.includes(role)) {
    //   return res.status(400).json({
    //     message: "Invalid role",
    //   });
    // }

    const user = await User.findOne({
      email: email.toLowerCase(),
      role,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const refreshToken = generateRefreshToken(user);

    // const role = user.role;
    user.refreshTokens[role] = refreshToken;

    await user.save();

    res.cookie(getRefreshCookieName(role), refreshToken, refreshCookieOptions);

    res.json(toSession(user));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    const { role } = req.body || {};

    const refreshRole = async (currentRole) => {
      try {
        const token = req.cookies[getRefreshCookieName(currentRole)];

        if (!token) return null;

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        if (decoded.role !== currentRole) {
          return null;
        }

        const user = await User.findOne({
          _id: decoded.id,
          role: currentRole,
        });

        if (!user || user.refreshTokens?.[currentRole] !== token) {
          return null;
        }

        const newRefreshToken = generateRefreshToken(user);

        user.refreshTokens[currentRole] = newRefreshToken;

        await user.save();

        res.cookie(
          getRefreshCookieName(currentRole),
          newRefreshToken,
          refreshCookieOptions,
        );

        return {
          accessToken: generateAccessToken(user),
          user: toClientUser(user),
        };
      } catch {
        return null;
      }
    };

    if (role) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      const session = await refreshRole(role);

      if (!session) {
        return res.status(401).json({
          message: "Invalid refresh token",
        });
      }

      return res.json(session);
    }

    const sessions = [];

    for (const currentRole of allowedRoles) {
      const session = await refreshRole(currentRole);

      if (session) {
        sessions.push(session);
      }
    }

    if (sessions.length === 0) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    res.json({
      sessions,
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
    const { role } = req.body || {};

    const logoutRole = async (currentRole) => {
      const token = req.cookies[getRefreshCookieName(currentRole)];

      if (!token) {
        res.clearCookie(
          getRefreshCookieName(currentRole),
          clearRefreshCookieOptions,
        );
        return;
      }

      const user = await User.findOne({
        [`refreshTokens.${currentRole}`]: token,
      });

      if (user) {
        user.refreshTokens[currentRole] = null;

        await user.save();
      }

      res.clearCookie(
        getRefreshCookieName(currentRole),
        clearRefreshCookieOptions,
      );
    };

    if (role) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      await logoutRole(role);
    } else {
      for (const currentRole of allowedRoles) {
        await logoutRole(currentRole);
      }
    }

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
  refreshToken,
  logout,
  me,
};
