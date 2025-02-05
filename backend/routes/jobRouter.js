import express from "express";
import {
  postJob,
  getALlJobs,
  getJobId,
  getAdminJobs,
  handleJobApproval,
  getJobStats,
  getAllJobsForAdmin,
  deleteJob,
  getJobsByCategory,
} from "../controllers/jobControllers.js";
import {authenticate, isAdmin} from "../middlewares/authenticate.js";

const router = express.Router();

router.route("/post").post(authenticate, postJob);
router.route("/get-all-job").get(getALlJobs);//authenticate
router.route("/get-job/:id").get(getJobId)//authenticate,
router.route("/get-admin-jobs").get(authenticate, getAdminJobs);

//category
router.route("/jobs-by-category").get(getJobsByCategory);


//admin
router.route("/handle-job/:id").put(authenticate, isAdmin, handleJobApproval);
router.route("/stats").get(authenticate, isAdmin, getJobStats);
router
  .route("/get-all-jobs-admin")
  .get(authenticate, isAdmin, getAllJobsForAdmin);
router.route("/delete-job/:id").delete(authenticate, isAdmin, deleteJob);

export default router;