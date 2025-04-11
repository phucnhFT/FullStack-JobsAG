import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobsModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../config/sendMail.js";

// ứng tuyển
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Id công việc là bắt buộc",
      });
    }
    // kiểm tra xem người dùng đã nộp đơn xin việc chưa
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã ứng tuyển công việc này rồi !",
      });
    }

    // kiểm tra công việc có tồn tại
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Công việc không tồn tại",
      });
    }
    // tạo một đơn ứng tuyển mới
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // Lấy thông tin người ứng tuyển (bao gồm email)
    const user = await User.findById(userId); // Lấy thông tin người dùng

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Gửi email thông báo cho người ứng tuyển
    const emailSubject = `Ứng Tuyển Công Việc Thành Công Vị Trí: ${job.title}, Tại công ty`;
    const emailText = `Chào ${user.fullname},\n\nBạn đã ứng tuyển thành công vào công việc: ${job.title}.
    \n\nChi tiết công việc:\n\n${job.description}.
    \n\nLương công việc: ${job.salary}.
    \n\nChúc bạn may mắn!`;

    // Gửi email
    await sendEmail(user.email, emailSubject, emailText);

    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      success: true,
      message: "Ứng tuyển công việc thành công.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi khi ứng tuyển!" });
  }
};

// xem các công ty đã ứng tuyển
export const getApplyJob = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId }) // tìm tất cả bản ghi
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn ứng tuyển của bạn!",
      });
    }
    return res.status(200).json({
      success: true,
      application,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi khi xem lịch sử ứng tuyển!" });
  }
};

// nhà tuyển dụng xem có bao nhiêu người đã tuyển dụng
export const getApplyCant = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Công việc không tồn tại" });
    }
    return res.status(200).json({ success: true, job });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Lỗi khi xem danh sách ứng tuyển!" });
  }
};

//cập nhật trạng thái ứng tuyển
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập trạng thái !",
      });
    }

    // tìm đơn ứng tuyển theo id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Đơn ứng tuyển không tồn tại",
      });
    }

    // cập nhật trạng thái
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công !",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái !" });
  }
};
