import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserForLogin,
} from "../models/userModel.js";

// Controller for handling user authentication (registration)
// This includes registering new users and ensuring that all required fields are provided,
// checking for existing users, hashing passwords, and creating new user records in the database.
export const register = async (req, res) => {
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
};

// Controller for handling user login (authentication)
// This includes verifying user credentials, checking if the user exists,
// comparing the provided password with the stored hashed password, and returning appropriate responses.
export const login = async (req, res) => {
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

  return res.status(200).json({ message: "Login successful!", user });
};

export const logout = async (req, res) => {
  // For simplicity, we'll just return a success message.
  // In a real application, you might handle token invalidation or session destruction here.
  return res.status(200).json({ message: "Logout successful!" });
};
