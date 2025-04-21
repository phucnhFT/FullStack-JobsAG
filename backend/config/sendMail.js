import nodemailer from "nodemailer";
import { User } from "../models/userModel.js";

const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    // cấu hình
    service: "gmail",
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_ACCOUNT, // email gửi
    to, //email nhận
    subject, // tiêu đề email
    text, // nội dung email
    html, // nội dung email dạng HTML
  };
  try {
    await transporter.sendMail(mailOptions); // phương thức gửi chứa tham số mailOptions
    console.log("Email đã được gửi thành công"); // Gửi email thành công
  } catch (err) {
    console.error("Lỗi khi gửi email:", err);
    throw new Error("Lỗi khi gửi email");
  }
};

const sendResetPasswordEmail = async (to, link) => {
  const user = await User.findOne({ email: to });
  const name = user.fullname;
  const subject = "JobsAG gửi bạn yêu cầu tạo mật khẩu mới";
  const text = `Xin chào ${name},\n\nChúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Để tiếp tục quá trình tạo mật khẩu mới, vui lòng làm theo các bước sau:\n\nBước 1: Nhấp vào liên kết dưới đây để reset mật khẩu của bạn:\n${link}\n\nBước 2: Nhập địa chỉ email của bạn và mật khẩu mới vào trang reset mật khẩu.\n\nBước 3: Nhấp vào nút "Reset Mật Khẩu" để hoàn tất quá trình.\n\nNếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.`;
  const html = `
    <div style="width: 600px; margin: 40px auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #333; color: #fff; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1>Reset Mật Khẩu</h1>
      </div>
      <div style="padding: 20px;">
        <p>Xin chào ${name},</p>
        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Để tiếp tục quá trình tạo mật khẩu mới, vui lòng làm theo các bước sau:</p>
        <p><strong>Bước 1:</strong> Nhấp vào liên kết dưới đây để đặt lại mật khẩu của bạn:</p>
        <p><a href="${`http://localhost:5173/reset-password/:token`}" style="background-color: #333; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Reset Mật Khẩu</a></p>
        <p><strong>Bước 2:</strong> Nhập địa chỉ email của bạn và mật khẩu mới vào trang đặt lại mật khẩu.</p>
        <p><strong>Bước 3:</strong> Nhấp vào nút "đặt lại Mật Khẩu" để hoàn tất quá trình.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      </div>
      <div style="background-color: #333; color: #fff; padding: 10px; text-align: center; border-radius: 0 0 10px 10px;">
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        <p>Trân trọng,</p>
        <p>JobsAG</p>
      </div>
    </div>
  `;
  await sendEmail(to, subject, text, html);
};

export { sendResetPasswordEmail, sendEmail };
