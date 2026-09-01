import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import upload from "../middleware/upload.js";
import {
  createAssignment,
  getAssignmentDetails,
  getAssignmentsByClassId,
  //   updateAssignment,
  //   deleteAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();

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
// router.put("/update-assignment/:id", updateAssignment);
// router.delete("/delete-assignment/:id", deleteAssignment);

export default router;
