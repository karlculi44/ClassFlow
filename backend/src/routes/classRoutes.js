import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";
import { createClass, getClasses } from "../controllers/classController.js";

const router = express.Router();

router.get("/", verifyToken, authorize("Admin"), getClasses);
router.post("/create-class", verifyToken, authorize("Admin"), createClass);

export default router;
