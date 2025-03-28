import express from "express";
import {
  createCompany,
  getCompany,
  getCompanyId,
  updateCompany,
  getCompanyDetailAndJobs,
} from "../controllers/companyControllers.js";
import {authenticate, isAdmin} from "../middlewares/authenticate.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/create").post(authenticate, createCompany);
router.route("/get-company").get(authenticate, getCompany);
router.route("/get-company/:id").get(authenticate, getCompanyId);
router.route("/update-company/:id").put(authenticate, singleUpload, updateCompany);
router.route("/get-details/:id").get(getCompanyDetailAndJobs);


export default router;
