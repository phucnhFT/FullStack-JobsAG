import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      // tiêu đề
      type: String,
      required: true,
    },
    description: {
      // mô tả
      type: String,
      required: true,
    },
    requirements: [
      // yêu cầu cho công việc
      {
        type: String,
      },
    ],
    benefits: {
      // mô tả
      type: String,
      required: true,
    },
    salary: {
      // lương
      type: Number,
      required: true,
    },
    experienceLevel: {
      // cấp độ kinh nghiệm cho công việc
      type: Number,
      required: true,
    },
    location: {
      // địa chỉ
      type: String,
      required: true,
    },
    jobType: {
      //thêm enum
      // loại công việc
      type: String,
      required: true,
    },
    position: {
      // Vị trí
      type: Number,
      required: true,
    },
    postDate: {
      // ngày đăng
      type: Date,
      required: true,
    },
    expiryDate: {
      // ngày hết hạn ứng tuyển
      type: Date,
      required: true,
    },
    company: {
      // công ty => tham chiếu từ docs company
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Đã xóa khoảng trắng
      required: true, // Đảm bảo trường này là bắt buộc
    },
    applications: [
      // ứng tuyển => tham chiếu từ docs application
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    approved: {
      // Trường mới để lưu trạng thái phê duyệt
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      type: String,
      default: null, // Mặc định là không có lý do từ chối
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
