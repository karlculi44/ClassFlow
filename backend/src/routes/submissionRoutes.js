import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import upload from "../middleware/upload.js";
import { submitAssignment } from "../controllers/submissionController.js";

const router = express.Router();

router.post(
  "/:assignmentId",
  verifyToken,
  authorize("Student"),
  upload.single("attachment"),
  submitAssignment,
);

export default router;
