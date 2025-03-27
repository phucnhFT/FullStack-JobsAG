import { Category } from "../models/categoryModel.js";
import {Job} from "../models/jobsModel.js"
import { Application } from "../models/applicationModel.js";

// xem tất cả danh mục
export const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const categories = await Category.find().skip(skip).limit(limit);
    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);
    return res.status(200).json({
      success: true,
      categories,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi tìm kiếm danh mục" });
  }
};

// xoa danh muc
export const deleteCatagory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res
       .status(400)
       .json({ success: false, message: "Thiếu ID danh mục" });
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res
       .status(404)
       .json({ success: false, message: "Danh mục không tồn tại" });
    }

    return res.status(200).json({ success: true, message: "Xóa danh mục thành công" });
  } catch (error) {
    return res
     .status(500)
     .json({ success: false, message: "Lỗi khi xóa danh mục" });
  }
}

// xem chi tiết danh mục
export const getCategoryDetail = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu ID danh mục" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Danh mục không tồn tại" });
    }

    const jobCount = await Job.countDocuments({ categoryId });
    const applicantCount = await Applicant.countDocuments({ categoryId });

    return res.status(200).json({
      success: true,
      category,
      jobCount,
      applicantCount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi xem chi tiết danh mục" });
  }
};