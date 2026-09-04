import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  createNewAssignment,
  deleteAssignmentById,
  getAssignmentById,
  getAssignmentByClassId,
  getAssignmentsByAdminId,
  getAssignmentsByStudentId,
  getStudentAssignmentById,
  updateAssignmentById,
} from "../models/assignmentModels.js";

export const getStudentAssignments = asyncHandler(async (req, res) => {
  const assignments = await getAssignmentsByStudentId(req.user.id);

  return res.status(200).json({
    message: "Assignments retrieved successfully",
    assignments,
  });
});

export const getAdminAssignments = asyncHandler(async (req, res) => {
  const assignments = await getAssignmentsByAdminId(req.user.id);

  return res.status(200).json({
    message: "Assignments retrieved successfully",
    assignments,
  });
});

export const getAdminAssignmentsByClassId = asyncHandler(
  async (req, res, next) => {
    const { classId } = req.params;
    const assignments = await getAssignmentByClassId(classId);

    res.status(200).json({
      message: "Assignments retrieved successfully",
      data: assignments,
    });
  },
);

export const getAdminAssignmentDetails = asyncHandler(async (req, res) => {
  const assignment = await getAssignmentById({
    adminId: req.user.id,
    classId: req.params.classId,
    assignmentId: req.params.assignmentId,
  });

  if (!assignment) {
    throw new AppError("Assignment not found.", 404);
  }

  return res.status(200).json({
    message: "Assignment retrieved successfully",
    assignment,
  });
});

export const getStudentAssignmentDetails = asyncHandler(async (req, res) => {
  const assignment = await getStudentAssignmentById({
    studentId: req.user.id,
    classId: req.params.classId,
    assignmentId: req.params.assignmentId,
  });

  if (!assignment) {
    throw new AppError("Assignment not found.", 404);
  }

  return res.status(200).json({
    message: "Assignment retrieved successfully",
    assignment,
  });
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

export const updateAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate } = req.body;
  const { classId, assignmentId } = req.params;

  if (!title?.trim() || !description?.trim() || !dueDate) {
    throw new AppError("Title, description, and due date are required.", 400);
  }

  const existingAssignment = await getAssignmentById({
    adminId: req.user.id,
    classId,
    assignmentId,
  });
  if (!existingAssignment) {
    throw new AppError("Assignment not found.", 404);
  }

  const attachmentName =
    req.file?.originalname ?? existingAssignment.attachment_name;
  const attachmentUrl = req.file
    ? `/uploads/assignments/${req.file.filename}`
    : (existingAssignment.attachment_url ?? existingAssignment.attachhment_url);

  await updateAssignmentById({
    classId,
    assignmentId,
    title: title.trim(),
    description: description.trim(),
    dueDate,
    attachmentName,
    attachmentUrl,
  });

  return res.status(200).json({ message: "Assignment updated successfully!" });
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  const deletedRows = await deleteAssignmentById({
    classId: req.params.classId,
    assignmentId: req.params.assignmentId,
  });

  if (!deletedRows) {
    throw new AppError("Assignment not found.", 404);
  }

  return res.status(200).json({ message: "Assignment deleted successfully!" });
});
