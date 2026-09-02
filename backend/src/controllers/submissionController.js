import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import pool from "../config/db.js";
import {
  createSubmission,
  getSubmissionByAssignmentAndStudent,
  updateSubmission,
} from "../models/submissionModels.js";

export const getStudentSubmission = asyncHandler(async (req, res) => {
  const submission = await getSubmissionByAssignmentAndStudent({
    assignmentId: req.params.assignmentId,
    studentId: req.user.id,
  });

  if (!submission) {
    throw new AppError("Submission not found.", 404);
  }

  res.status(200).json({ submission });
});

const getSubmissionPayload = (req) => ({
  content: req.body.content?.trim(),
  attachmentName: req.file?.originalname ?? null,
  attachmentUrl: req.file ? `/uploads/assignments/${req.file.filename}` : null,
});

export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { content, attachmentName, attachmentUrl } = getSubmissionPayload(req);

  if (!assignmentId || (!content && !req.file)) {
    throw new AppError("Written response or an attachment is required.", 400);
  }

  const [assignmentRows] = await pool.query(
    "SELECT id FROM assignments WHERE id = ? AND due_date >= CURDATE() LIMIT 1",
    [assignmentId],
  );

  if (!assignmentRows[0]) {
    throw new AppError("The submission deadline has passed.", 400);
  }

  const submission = await createSubmission({
    assignmentId,
    studentId: req.user.id,
    content,
    attachmentName,
    attachmentUrl,
  });

  if (!submission) {
    throw new AppError("Assignment not found.", 404);
  }

  res.status(201).json({
    message: "Assignment submitted successfully!",
    submission,
  });
});

export const resubmitAssignment = asyncHandler(async (req, res) => {
  const { content, attachmentName, attachmentUrl } = getSubmissionPayload(req);

  if (!content && !req.file) {
    throw new AppError("Written response or an attachment is required.", 400);
  }

  const submission = await updateSubmission({
    assignmentId: req.params.assignmentId,
    studentId: req.user.id,
    content,
    attachmentName,
    attachmentUrl,
  });

  if (!submission) {
    throw new AppError("Submission not found.", 404);
  }

  res.status(200).json({
    message: "Submission updated successfully!",
    submission,
  });
});
