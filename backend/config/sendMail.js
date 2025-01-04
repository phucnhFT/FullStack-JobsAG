import nodemailer from 'nodemailer';


const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({ // cấu hình 
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
    };
    try {
      await transporter.sendMail(mailOptions); // phương thức gửi chứa tham số mailOptions
      console.log("Email đã được gửi thành công"); // Gửi email thành công
    } catch (err) {
        console.error("Lỗi khi gửi email:", err);
        throw new Error("Lỗi khi gửi email");
    }
}
export default sendEmail;