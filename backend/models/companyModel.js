import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      // tên công ty ( cơ quan)
      type: String,
      required: true,
      unique: true,
    },
    description: {
      // mô tả về công ty
      type: String,
    },
    website: {
      // website công ty
      type: String,
    },
    location: {
      // địa chỉ
      type: String,
    },
    logo: {
      // logo công ty
      type: String,
    },
    userId: {
      // tham chiếu từ docs User
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);
export const Company = mongoose.model("Company", companySchema);
