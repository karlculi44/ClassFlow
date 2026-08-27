import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getMe);

export default router;
