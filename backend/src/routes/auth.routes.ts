import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  login,
  logout,
  refreshToken,
  register,
  verifyEmail,
  getMe,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.post("/refresh-token", refreshToken);
router.get("/me", authenticate, getMe);

export default router;
