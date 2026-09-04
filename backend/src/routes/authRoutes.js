import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import validate from "../middleware/validate.js";
import authorize from "../middleware/authorize.js";
import {
  register,
  login,
  logout,
  getMe,
  getProfile,
  updateProfile,
  changePassword,
  getStudents,
  refresh,
  welcomeAdmin,
} from "../controllers/authController.js";
import {
  registerSchema,
  loginSchema,
  profileSchema,
  changePasswordSchema,
} from "../schemas/authSchema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", verifyToken, getMe);
router.get("/profile", verifyToken, getProfile);
router.patch("/profile", verifyToken, validate(profileSchema), updateProfile);
router.patch(
  "/profile/password",
  verifyToken,
  validate(changePasswordSchema),
  changePassword,
);
router.get("/students", verifyToken, authorize("Admin"), getStudents);
router.get("/admin", verifyToken, authorize("Admin"), welcomeAdmin);

export default router;
