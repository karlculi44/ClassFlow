import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import {
  getReportSummary,
  getClassReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/", verifyToken, authorize("Admin"), getReportSummary);
router.get("/:classId", verifyToken, authorize("Admin"), getClassReport);

export default router;
