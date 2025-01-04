import express from "express";
import {
  applyJob,
  getApplyJob,
  getApplyCant,
  updateStatus,
} from "../controllers/applicationControllers.js";
import {authenticate} from "../middlewares/authenticate.js";

const router = express.Router();


router.route("/apply/:id").get(authenticate, applyJob);
router.route("/get-applicants").get(authenticate, getApplyJob);
router.route("/:id/applicants").get(authenticate, getApplyCant);
router.route("/status/:id/update").post(authenticate, updateStatus);

export default router;