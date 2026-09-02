import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import upload from "../middleware/upload.js";
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
  upload.single("attachment"),
  submitAssignment,
);

router.put(
  "/:assignmentId",
  verifyToken,
  authorize("Student"),
  upload.single("attachment"),
  resubmitAssignment,
);

export default router;
