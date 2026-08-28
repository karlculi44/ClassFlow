import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { createNewClass, findClassesByAdminId } from "../models/classModel.js";
import { findUserById } from "../models/userModel.js";

export const getClasses = asyncHandler(async (req, res) => {
  const classes = await findClassesByAdminId(req.user.id);

  return res.status(200).json({
    message: "Classes retrieved successfully!",
    classes,
  });
});

export const createClass = asyncHandler(async (req, res) => {
  const { code, name, schedule, capacity } = req.body;
  const { user } = req;
  const findUser = await findUserById(user.id);

  if (!findUser) {
    throw new AppError("User not found!", 404);
  }
  const adminId = findUser.id;

  if (!code || !adminId || !name || !schedule || !capacity) {
    throw new AppError("All fields are required!", 400);
  }

  const newClass = await createNewClass({
    code,
    adminId,
    name,
    schedule,
    capacity,
  });

  return res
    .status(201)
    .json({ message: "Class created successfully!", class: newClass });
});
