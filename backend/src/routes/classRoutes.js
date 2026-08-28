import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

const router = express.Router();

router.get("/", verifyToken, authorize("Admin"), getClasses);
router.post("/create-class", verifyToken, authorize("Admin"), createClass);
router.put("/update-class/:id", verifyToken, authorize("Admin"), updateClass);
router.delete(
  "/delete-class/:id",
  verifyToken,
  authorize("Admin"),
  deleteClass,
);

export default router;
