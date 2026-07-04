import { Router } from "express";
import { asyncRoute } from "../middleware/error.js";
import { protect } from "../middleware/auth.js";
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
} from "../controllers/leadController.js";

const router = Router();

router.use(protect);

router.route("/").get(asyncRoute(getLeads)).post(asyncRoute(createLead));
router.route("/:id").get(asyncRoute(getLead)).put(asyncRoute(updateLead)).delete(asyncRoute(deleteLead));
router.route("/:id/status").patch(asyncRoute(updateLeadStatus));

export default router;
