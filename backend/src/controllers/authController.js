import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  createUser,
  findUserByEmail,
  findUserForLogin,
  findUserById,
  deleteRefreshToken,
  saveRefreshToken,
  findRefreshTokenByUserId,
} from "../models/userModel.js";
import hashToken from "../utils/hashToken.js";

// Controller for handling user authentication (registration)
// This includes registering new users and ensuring that all required fields are provided,
// checking for existing users, hashing passwords, and creating new user records in the database.
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new AppError("All fields are required!", 400);
  }

  const existingUser = await findUserByEmail(email);

  // Check if the user already exists
  if (existingUser) {
    throw new AppError("Email is already taken", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ name, email, hashedPassword, role });

  return res.status(201).json({ message: "User registered successfully!" });
});

// Controller for handling user login (authentication)
// This includes verifying user credentials, checking if the user exists,
// comparing the provided password with the stored hashed password, and returning appropriate responses.
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required!", 400);
  }

  const user = await findUserForLogin(email);

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    },
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const hashedRefreshToken = hashToken(refreshToken);
  await saveRefreshToken(user.id, hashedRefreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return res.status(200).json({ message: "Login successful!", user });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return res
    .status(200)
    .json({ message: "User retrieved successfully!", user });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError("Refresh token is required!", 400);
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  await deleteRefreshToken(decoded.id);

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({ message: "Logout successful!" });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError("Refresh token is required!", 400);
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  if (!decoded) {
    throw new AppError("Invalid refresh token.", 401);
  }

  const user = await findUserById(decoded.id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const storedHashedRefreshToken = await findRefreshTokenByUserId(decoded.id);
  const hashedRefreshToken = hashToken(refreshToken);

  if (
    !storedHashedRefreshToken ||
    storedHashedRefreshToken !== hashedRefreshToken
  ) {
    throw new AppError("Unauthorized.", 401);
  }

  const newAccessToken = jwt.sign(
    { id: decoded.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const hashedNewRefreshToken = hashToken(newRefreshToken);

  await saveRefreshToken(decoded.id, hashedNewRefreshToken);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return res.status(200).json({ message: "Token refreshed successfully!" });
});

export const welcomeAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "Welcome, Admin!" });
});
