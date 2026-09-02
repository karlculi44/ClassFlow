import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import upload from "../middleware/upload.js";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentDetails,
  getAssignmentsByClassId,
  getStudentAssignments,
  getStudentAssignmentDetails,
  updateAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();

router.get(
  "/student",
  verifyToken,
  authorize("Student"),
  getStudentAssignments,
);
router.get(
  "/student/:classId/:assignmentId",
  verifyToken,
  authorize("Student"),
  getStudentAssignmentDetails,
);

router.get(
  "/:classId/:assignmentId",
  verifyToken,
  authorize("Admin"),
  getAssignmentDetails,
);
router.get(
  "/:classId",
  verifyToken,
  authorize("Admin"),
  getAssignmentsByClassId,
);
router.post(
  "/create-assignment/:classId",
  verifyToken,
  authorize("Admin"),
  upload.single("attachment"),
  createAssignment,
);
router.put(
  "/:classId/:assignmentId",
  verifyToken,
  authorize("Admin"),
  upload.single("attachment"),
  updateAssignment,
);
router.delete(
  "/:classId/:assignmentId",
  verifyToken,
  authorize("Admin"),
  deleteAssignment,
);

export default router;
