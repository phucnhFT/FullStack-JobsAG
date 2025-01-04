import { Category } from "../models/categoryModel.js";

// xem tất cả danh mục
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi tìm kiếm danh mục" });
  }
};
