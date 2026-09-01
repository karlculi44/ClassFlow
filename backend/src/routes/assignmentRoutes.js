import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import {
  createAssignment,
  getAssignmentsByClassId,
  //   updateAssignment,
  //   deleteAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();

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
  createAssignment,
);
// router.put("/update-assignment/:id", updateAssignment);
// router.delete("/delete-assignment/:id", deleteAssignment);

export default router;
