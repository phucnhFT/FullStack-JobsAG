import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      // Họ & Tên
      type: String,
      required: true,
    },
    email: {
      // Email
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      // Sđt
      type: Number,
      required: true,
    },
    password: {
      // Mật khẩu
      type: String,
      required: true,
    },
    role: {
      // vai trò
      type: String,
      enum: ["Ứng Viên", "Nhà Tuyển Dụng", "Admin"],
      required: true,
    },
    profile: {
      // Hồ Sơ
      bio: { type: String }, // tiểu sử
      skills: [{ type: String }], // kĩ năng
      resume: { type: String }, // Link CV
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // tham chiếu từ docs company
      profilePhoto: {// avt
        type: String,
        default: "",
      },
    },
    interestedCompanies: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    ],
    resetToken: String, // token reset
    resetTokenExpire: Date, // thời gian hết hạn của token
  },
  { timestamps: true, strict: true }
);
export const User = mongoose.model("User", userSchema);
