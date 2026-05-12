const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/modUser");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

// REGISTER
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created",
      user,
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
    const { email, password } =
      req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge:
          30 * 24 * 60 * 60 * 1000,
      }
    );

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REFRESH TOKEN
const refreshToken = async (
  req,
  res
) => {
  try {
    const token =
      req.cookies.refreshToken;

    if (!token) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(
      decoded.id
    );

    if (
      !user ||
      user.refreshToken !== token
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const accessToken =
      generateAccessToken(user);

    res.json({
      accessToken,
    });
  } catch {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const token =
      req.cookies.refreshToken;

    if (token) {
      const user =
        await User.findOne({
          refreshToken: token,
        });

      if (user) {
        user.refreshToken = null;

        await user.save();
      }
    }

    res.clearCookie("refreshToken");

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
    const user = await User.findById(
      req.user.id
    ).select("-password -refreshToken");

    const accessToken =
      generateAccessToken(user);

    res.json({
      user,
      accessToken,
    });
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
