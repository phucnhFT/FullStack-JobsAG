import express from "express";
import {
  getCategories,
  deleteCatagory,
  getCategoryDetail,
} from "../controllers/categoryControllers.js";
import { authenticate, isAdmin } from "../middlewares/authenticate.js";

const router = express.Router();

//categories
router.route("/get-categories").get(getCategories);
router.route("/delete-categories/:id").delete(authenticate, isAdmin, deleteCatagory);
router.route("/categories/:id").get(authenticate, isAdmin, getCategoryDetail);



export default router;
