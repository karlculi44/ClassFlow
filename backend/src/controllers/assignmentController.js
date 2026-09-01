import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  createNewAssignment,
  getAssignmentByClassId,
} from "../models/assignmentModels.js";

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
  const { title, description, dueDate, attachment = null } = req.body;
  const { classId } = req.params;

  if (!classId || !title?.trim() || !description?.trim() || !dueDate) {
    throw new AppError(
      "Class, title, description, and due date are required.",
      400,
    );
  }

  if (attachment !== null && typeof attachment !== "string") {
    throw new AppError("Attachment must be a string or null.", 400);
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
