import { Router } from "express";
import { asyncRoute } from "../middleware/error.js";
import { protect } from "../middleware/auth.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = Router();

router.use(protect);
router.get("/", asyncRoute(getDashboard));

export default router;
