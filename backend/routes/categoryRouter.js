import express from "express";
import { getCategories } from "../controllers/categoryControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.route("/get-categories").get(getCategories);

export default router;
