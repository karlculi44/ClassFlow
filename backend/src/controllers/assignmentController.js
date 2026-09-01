import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  createNewAssignment,
  getAssignmentByClassId,
} from "../models/assignmentModels.js";

export const getAssignmentsByClassId = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;
  const assignments = await getAssignmentByClassId(classId);

  res
    .status(200)
    .json({ message: "Assignments retrieved successfully", data: assignments });
});

export const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate } = req.body;
  const { classId } = req.params;

  if (!classId || !title?.trim() || !description?.trim() || !dueDate) {
    throw new AppError(
      "Class, title, description, and due date are required.",
      400,
    );
  }

  const attachmentName = req.file?.originalname ?? null;
  const attachmentUrl = req.file
    ? `/uploads/assignments/${req.file.filename}`
    : null;

  const assignment = await createNewAssignment({
    classId,
    title: title.trim(),
    description: description.trim(),
    dueDate,
    attachmentName,
    attachmentUrl,
  });

  return res.status(201).json({
    message: "Assignment created successfully!",
    assignment,
  });
});
