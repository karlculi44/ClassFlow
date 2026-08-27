import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  register,
  login,
  logout,
  getMe,
  refresh,
} from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", verifyToken, getMe);

export default router;
