import { Router } from "express";
import { asyncRoute } from "../middleware/error.js";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.use(protect, adminOnly);

router.route("/").get(asyncRoute(getUsers)).post(asyncRoute(createUser));
router
  .route("/:id")
  .get(asyncRoute(getUser))
  .put(asyncRoute(updateUser))
  .delete(asyncRoute(deleteUser));

export default router;
