import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createUser,
  findUserByEmail,
  findUserForLogin,
  findUserById,
  deleteRefreshToken,
  saveRefreshToken,
} from "../models/userModel.js";

// Controller for handling user authentication (registration)
// This includes registering new users and ensuring that all required fields are provided,
// checking for existing users, hashing passwords, and creating new user records in the database.
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).send("All fields are required!");
  }

  const existingUser = await findUserByEmail(email);

  // Check if the user already exists
  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ name, email, hashedPassword, role });

  return res
    .status(201)
    .json({ message: "User registered successfully!", user: newUser });
});

// Controller for handling user login (authentication)
// This includes verifying user credentials, checking if the user exists,
// comparing the provided password with the stored hashed password, and returning appropriate responses.
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required!");
  }

  const user = await findUserForLogin(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
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

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await saveRefreshToken(user.id, hashedRefreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({ message: "Login successful!", user });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res
    .status(200)
    .json({ message: "User retrieved successfully!", user });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required!" });
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
