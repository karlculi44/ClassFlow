import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import validate from "../middleware/validate.js";
import authorize from "../middleware/authorize.js";
import {
  register,
  login,
  logout,
  getMe,
  getStudents,
  refresh,
  welcomeAdmin,
} from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", verifyToken, getMe);
router.get("/students", verifyToken, authorize("Admin"), getStudents);
router.get("/admin", verifyToken, authorize("Admin"), welcomeAdmin);

export default router;
