import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import validate from "../middleware/validate.js";
import authorize from "../middleware/authorize.js";
import {
  register,
  login,
  logout,
  getMe,
  refresh,
  welcomeInstructor,
} from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", verifyToken, getMe);
router.get(
  "/instructor",
  verifyToken,
  authorize("Instructor"),
  welcomeInstructor,
);

export default router;
