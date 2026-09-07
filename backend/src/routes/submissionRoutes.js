import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import upload from "../middleware/upload.js";
import validate, { validateParams } from "../middleware/validate.js";
import {
  gradeSubmissionParamsSchema,
  gradeSubmissionSchema,
  submitAssignmentParamsSchema,
  submitAssignmentSchema,
} from "../schemas/submissionSchema.js";
import {
  getAdminStudentSubmission,
  getAdminSubmissions,
  getStudentSubmission,
  gradeSubmission,
  resubmitAssignment,
  submitAssignment,
} from "../controllers/submissionController.js";

const router = express.Router();

router.get(
  "/admin/:classId/:assignmentId",
  verifyToken,
  authorize("Admin"),
  getAdminSubmissions,
);

router.get(
  "/admin/:classId/:assignmentId/:studentId",
  verifyToken,
  authorize("Admin"),
  getAdminStudentSubmission,
);

router.put(
  "/admin/:classId/:assignmentId/:studentId",
  verifyToken,
  authorize("Admin"),
  validateParams(gradeSubmissionParamsSchema),
  validate(gradeSubmissionSchema),
  gradeSubmission,
);

router.get(
  "/:assignmentId",
  verifyToken,
  authorize("Student"),
  getStudentSubmission,
);

router.post(
  "/:assignmentId",
  verifyToken,
  authorize("Student"),
  validateParams(submitAssignmentParamsSchema),
  upload.single("attachment"),
  validate(submitAssignmentSchema),
  submitAssignment,
);

router.put(
  "/:assignmentId",
  verifyToken,
  authorize("Student"),
  validateParams(submitAssignmentParamsSchema),
  upload.single("attachment"),
  validate(submitAssignmentSchema),
  resubmitAssignment,
);

export default router;
