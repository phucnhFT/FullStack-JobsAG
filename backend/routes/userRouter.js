import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
  addInterestedCompany,
  removeInterestedCompany,
  getInterestedCompany,
  getUsers,
  deleteUser,
  getUserDetail,
  addUser,
  updateUser,
} from "../controllers/userControllers.js";
import {authenticate, isAdmin} from "../middlewares/authenticate.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload,register); 
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").put(authenticate, singleUpload, updateProfile);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

router.route("/interested-company").post(authenticate, addInterestedCompany);
router
  .route("/delete-interested/:companyId")
  .delete(authenticate, removeInterestedCompany);
router.route("/get-interested").get(authenticate, getInterestedCompany);

//Admin
router.route("/get-users").get(authenticate, isAdmin, getUsers);
router.route("/delete-user/:id").delete(authenticate, isAdmin, deleteUser);
router.route("/get-detail/:id").get(authenticate, isAdmin, getUserDetail);
router.route("/add-user").post(authenticate, singleUpload, isAdmin, addUser); 
router.put("/update-user/:id", authenticate, singleUpload, isAdmin, updateUser);


export default router;
