import express from "express";
import {
  getCategories,
  deleteCatagory,
} from "../controllers/categoryControllers.js";
import { authenticate, isAdmin } from "../middlewares/authenticate.js";

const router = express.Router();

router.route("/get-categories").get(getCategories);
router.route("/delete-categories/:id").delete(authenticate, isAdmin, deleteCatagory);

export default router;
