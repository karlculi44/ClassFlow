import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { createSubmission } from "../models/submissionModels.js";

export const submitAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;
  const content = req.body.content?.trim();
  const attachmentName = req.file?.originalname ?? null;
  const attachmentUrl = req.file
    ? `/uploads/assignments/${req.file.filename}`
    : null;

  if (!assignmentId || (!content && !req.file)) {
    throw new AppError("Written response or an attachment is required.", 400);
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
