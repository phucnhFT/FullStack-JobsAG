import express from "express";
import {
  createCompany,
  getCompany,
  getCompanyId,
  updateCompany,
} from "../controllers/companyControllers.js";
import {authenticate, isAdmin} from "../middlewares/authenticate.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/create").post(authenticate, createCompany);
router.route("/get-company").get(authenticate, getCompany);
router.route("/get-company/:id").get(authenticate, getCompanyId);
router.route("/update-company/:id").put(authenticate, singleUpload, updateCompany);

export default router;
