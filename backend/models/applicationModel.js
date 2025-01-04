import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      // công việc
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      // người ứng tuyển => tham chiếu từ docs user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      // trạng thái hồ sơ
      type: String,
      enum: ["đang chờ", "đã chấp nhận", "đã từ chối"],
      default: "đang chờ",
    },
  },
  { timestamps: true }
);
export const Application = mongoose.model("Application", applicationSchema);
