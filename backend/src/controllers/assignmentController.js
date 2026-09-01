import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  createNewAssignment,
  getAssignmentByClassId,
} from "../models/assignmentModels.js";
import { findClassByIdAndAdminId } from "../models/classModel.js";

export const getAssignmentsByClassId = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;
  const assignments = await getAssignmentByClassId(classId);

  if (!assignments || assignments.length === 0) {
    throw new AppError("No assignments found for this class.", 404);
  }

  res
    .status(200)
    .json({ message: "Assignments retrieved successfully", data: assignments });
});

export const createAssignment = asyncHandler(async (req, res) => {
  const { classId, title, description, dueDate, attachment = null } = req.body;

  if (!classId || !title?.trim() || !description?.trim() || !dueDate) {
    throw new AppError(
      "Class, title, description, and due date are required.",
      400,
    );
  }

  if (attachment !== null && typeof attachment !== "string") {
    throw new AppError("Attachment must be a string or null.", 400);
  }

  const classItem = await findClassByIdAndAdminId({
    classId,
    adminId: req.user.id,
  });

  if (!classItem) {
    throw new AppError("Class not found.", 404);
  }

  const assignment = await createNewAssignment({
    classId,
    title: title.trim(),
    description: description.trim(),
    dueDate,
    attachment,
  });

  return res.status(201).json({
    message: "Assignment created successfully!",
    assignment,
  });
});
