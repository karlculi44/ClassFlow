import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import validate from "../middleware/validate.js";
import authorize from "../middleware/authorize.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
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
  googleLogin,
  createAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  registerSchema,
  loginSchema,
  profileSchema,
  changePasswordSchema,
  createAdminSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/authSchema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post(
  "/admins",
  verifyToken,
  authorize("Admin"),
  validate(createAdminSchema),
  createAdmin,
);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/test-email", async (req, res) => {
  const testEmail = process.env.SMTP_USER;

  await sendPasswordResetEmail({
    email: testEmail,
    resetUrl: "http://localhost:5173/reset-password?token=test-token",
  });

  res.json({
    message: "Test password reset email sent successfully.",
  });
});
router.post("/google-login", googleLogin);
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
