import { Router } from "express";
import { asyncRoute } from "../middleware/error.js";
import { protect } from "../middleware/auth.js";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = Router();

router.use(protect);

router.route("/").get(asyncRoute(getCustomers)).post(asyncRoute(createCustomer));
router
  .route("/:id")
  .get(asyncRoute(getCustomer))
  .put(asyncRoute(updateCustomer))
  .delete(asyncRoute(deleteCustomer));

export default router;
