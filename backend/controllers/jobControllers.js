import { Job } from "../models/jobsModel.js";
import { User } from "../models/userModel.js";
import { Company } from "../models/companyModel.js";
import { Category } from "../models/categoryModel.js";
import sendEmail from "../config/sendMail.js";
import schedule from "node-schedule"; 
import mongoose from "mongoose";

// Nhà tuyển dụng đăng tin việc làm
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      postDate,
      expiryDate,
      category, 
    } = req.body;

    const userId = req.id; 

    // Kiểm tra các trường bắt buộc
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId ||
      !postDate ||
      !expiryDate ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đủ thông tin!",
      });
    }

    // Kiểm tra hoặc tạo category
    let categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: category });
    }
    // Tạo công việc mới
    const newJob = await Job.create({
      title,
      description,
      requirements,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId, // Gán userId cho trường created_by
      postDate: new Date(postDate),
      expiryDate: new Date(expiryDate),
      approved: false, // Hoặc true nếu bạn muốn tự động phê duyệt
      category: categoryDoc._id, // Gắn ObjectId của category vào job
    });

    // Kiểm tra công ty
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Công ty không tồn tại",
      });
    }

    // Kiểm tra người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Gửi email cho người dùng quan tâm đến công ty
    const usersInterestedInCompany = await User.find({
      interestedCompanies: companyId,
    });

    for (let interestedUser of usersInterestedInCompany) {
      const emailSubject = `Công Việc Mới từ Công Ty: ${company.name}`;
      const emailText = `Chào ${interestedUser.fullname},\n\nCông ty ${company.name} vừa đăng một công việc mới: ${newJob.title}.\n\nChi tiết công việc:\n${newJob.description}.\n\nLương công việc: ${newJob.salary}.\n\nĐịa điểm: ${newJob.location}.\n\nChúc bạn may mắn!`;

      await sendEmail(interestedUser.email, emailSubject, emailText);
    }

    // Lên lịch công việc để đánh dấu công việc đã hết hạn sau ngày hết hạn
    schedule.scheduleJob(new Date(expiryDate), async () => {
      await Job.findByIdAndUpdate(newJob._id, { approved: false }); // Cập nhật trạng thái công việc
    });

    return res.status(201).json({
      success: true,
      message: "Tạo công việc thành công đợi phê duyệt của Admin",
      newJob,
    });
  } catch (err) {
    console.error("Lỗi khi đăng tin:", err);
    return res.status(500).json({ message: "Lỗi khi đăng tin" });
  }
};

//Xem các công việc và tìm kiếm
export const getALlJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const currentDate = new Date();
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
      approved: true, // Chỉ lấy công việc đã được phê duyệt
    };
    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ created: -1 });

    // xử lý danh sách -> thêm thuộc tính isExpired (state trả về là false hoac true)
    const formattedJobs = jobs.map((job) => {
      return {
        ...job.toObject(),
        isExpired: new Date(job.expiryDate) < currentDate,
      };
    });

    return res.status(200).json({
      success: true,
      jobs: formattedJobs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi khi xem " });
  }
};

// Tìm việc theo ID
export const getJobId = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({ path: "applications" });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Công việc không tồn tại",
      });
    }
    //kiểm tra state hết hạn của công việc -> trả về công việc với trạng thái hết hạn 
    const isExpired = new Date(job.expiryDate) < new Date();
    return res.status(200).json({
      job: { ...job.toObject(), isExpired },
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi xem " });
  }
};

// xem nhà tuyển dụng đã tạo được bao nhiêu công việc?
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({
      created_by: adminId,
    })
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    const currentDate = new Date();
    const formattedJobs = jobs.map((job) => {
      return {
        ...job.toObject(),
        isExpired: new Date(job.expiryDate) < currentDate, // thêm trạng thái hết hạn 
      };
    });

    return res.status(200).json({
      success: true,
      jobs: formattedJobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi xem " });
  }
};

//ADMIN-----------

// Hàm phê duyệt công việc
export const handleJobApproval = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { action, reason } = req.body; // action: "approve" hoặc "reject"

    const job = await Job.findById(jobId).populate("created_by");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Công việc không tồn tại",
      });
    }

    if (action === "approve") { // Cập nhật trạng thái phê duyệt
      job.approved = true; // Đặt trạng thái phê duyệt
      job.rejectionReason = null; // Đặt lý do từ chối thành null
      await job.save();

      // Gửi email thông báo cho nhà tuyển dụng
      const emailSubject = `Công việc của bạn đã được phê duyệt: ${job.title}`;
      const emailText = `Chào ${job.created_by.fullname},\n\nCông việc "${job.title}" của bạn đã được phê duyệt.\n\nChi tiết công việc:\n${job.description}\n\nChúc bạn may mắn!`;

      await sendEmail(job.created_by.email, emailSubject, emailText);

      return res.status(200).json({
        success: true,
        message: "Công việc đã được phê duyệt và thông báo đã được gửi đến nhà tuyển dụng.",
      });
    } else if (action === "reject") {
      // Cập nhật trạng thái từ chối
      job.approved = false; // Đặt lại trạng thái phê duyệt
      job.rejectionReason = reason; // Lưu lý do từ chối
      await job.save();

      // Gửi email thông báo cho nhà tuyển dụng
      const emailSubject = `Công việc của bạn đã bị từ chối: ${job.title}`;
      const emailText = `Chào ${job.created_by.fullname},\n\nCông việc "${job.title}" của bạn đã bị từ chối.\n\nLý do: ${reason}\n\nChúc bạn may mắn trong các ứng tuyển tiếp theo!`;

      await sendEmail(job.created_by.email, emailSubject, emailText);

      return res.status(200).json({
        success: true,
        message: "Công việc đã bị từ chối và thông báo đã được gửi đến nhà tuyển dụng.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Hành động không hợp lệ. Vui lòng sử dụng 'approve' hoặc 'reject'.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi khi xử lý yêu cầu" });
  }
};
//update stars
export const getJobStats = async (req, res) => {
  try {
    const { year, month, day, companyId } = req.params;

    // Kiểm tra xem companyId có hợp lệ hay không
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({ message: "Công ty không tồn tại" });
    }

    // Tạo ngày tháng năm từ tham số
    const selectedDate = new Date(year, month - 1, day);

    // Tính toán thời gian bắt đầu cho tuần, tháng và năm
    const startOfWeek = new Date(
      selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay())
    );
    const startOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const startOfYear = new Date(selectedDate.getFullYear(), 0, 1);

    // Thống kê số lượng công việc
    const weeklyJobs = await Job.countDocuments({
      postDate: { $gte: startOfWeek },
      company: companyId,
    });
    const monthlyJobs = await Job.countDocuments({
      postDate: { $gte: startOfMonth },
      company: companyId,
    });
    const yearlyJobs = await Job.countDocuments({
      postDate: { $gte: startOfYear },
      company: companyId,
    });

    // Thống kê toàn bộ công việc trong hệ thống
    const totalJobs = await Job.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        weekly: weeklyJobs,
        monthly: monthlyJobs,
        yearly: yearlyJobs,
        total: totalJobs,
      },
      company: company.name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi khi lấy thống kê công việc" });
  }
};


export const getAllJobsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const limit = parseInt(req.query.limit) || 10; // Số lượng công việc trên mỗi trang
    const jobs = await Job.find()
      .populate({ path: "company" })
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo
      .skip((page - 1) * limit) // Bỏ qua số lượng công việc đã được hiển thị
      .limit(limit); // Giới hạn số lượng công việc trả về

    const totalJobs = await Job.countDocuments(); // Tổng số công việc
    const totalPages = Math.ceil(totalJobs / limit); // Tổng số trang

    return res.status(200).json({
      success: true,
      jobs,
      totalPages,
      currentPage: page,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi khi xem " });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id; // Lấy ID công việc từ tham số URL
    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Công việc không tồn tại",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Công việc đã được xóa thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi khi xóa công việc" });
  }
};

// Lọc công việc theo danh mục
export const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.query; 

    // check xem category có hợp lệ không
    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Danh mục không hợp lệ hoặc bị thiếu",
      });
    }

    // Tìm công việc theo danh mục
    const jobs = await Job.find({ category })
      .populate("company") // populate thông tin công ty
      .sort({ createdAt: -1 }); // sắp xếp theo thời gian tạo mới nhất

    // Kiểm tra xem có công việc nào thuộc danh mục không
    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy công việc nào thuộc danh mục này",
      });
    }

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi tải công việc" });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json({ success: true, companies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi khi lấy danh sách công ty" });
  }
};

