import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import {
  addStudents,
  addStudent,
  getEnrolledStudents,
} from "../controllers/enrollmentController.js";

const router = express.Router();

router.get("/:classId", verifyToken, authorize("Admin"), getEnrolledStudents);

router.post("/:classId/students", verifyToken, authorize("Admin"), addStudents);

router.post(
  "/:classId/:studentId",
  verifyToken,
  authorize("Admin"),
  addStudent,
);

export default router;
