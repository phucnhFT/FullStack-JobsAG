import { Company } from "../models/companyModel.js";
import getDataUri from "../config/datauri.js";
import cloudinary from "../config/cloudinary.js";

// đăng ký
export const createCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tên Công ty !",
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        success: false,
        message: "Không thể đăng ký trùng tên công ty !!",
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Công ty đã được đăng ký",
      company,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "lỗi khi đăng ký công ty",
    });
  }
};

// lấy danh sách công ty mà user(Nhà tuyển Dụng) đã đăng ký
export const getCompany = async (req, res) => {
  try {
    const userId = req.id // user đã đăng nhập
    const companies = await Company.find({ userId })

    if (!companies) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy công ty.",
      });
    }
    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "lỗi xem công ty",
    });
  }
};

//lấy công ty theo Id
export const getCompanyId = async (req, res) => {
    try {
        const companyId = req.params.id
        const company = await Company.findById(companyId)
        if (!company) {
            return res.status(404).json({
              success: false,
              message: "Không tìm thấy công ty.",
            });
        }
        return res.status(200).json({
            success: true,
            company,
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
          success: false,
          message: "lỗi xem công ty",
        });
    }
}

// chỉnh sửa thông tin 
export const updateCompany = async (req,res) => {
  try {
    const {name, description, website, location } = req.body

      const file = req.file;
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      const logo = cloudResponse.secure_url;

      const updateData = { name, description, website, location, logo};

      const company = await Company.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy công ty.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
      });

  } catch (e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: "lỗi chỉnh sửa",
    });
  }
}

//chi tiet cong ty