import { Router } from "express";
import { asyncRoute } from "../middleware/error.js";
import { protect } from "../middleware/auth.js";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", asyncRoute(register));
router.post("/login", asyncRoute(login));
router.get("/me", protect, asyncRoute(getMe));
router.post("/logout", protect, asyncRoute(logout));

export default router;
