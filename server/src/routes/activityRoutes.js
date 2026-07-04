import { Router } from "express";
import { asyncRoute } from "../middleware/error.js";
import { protect } from "../middleware/auth.js";
import { getActivities } from "../controllers/activityController.js";

const router = Router();

router.use(protect);
router.get("/", asyncRoute(getActivities));

export default router;
