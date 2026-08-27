import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/userModel.js";

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
