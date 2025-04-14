import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const authenticate = async (req, res, next) => {
  try {
    //const token = req.headers.token?.split(" ")[1]; // Lấy token từ Authorization header
    const token = req.cookies.token; // lấy token từ cookie trong trình duyệt
    if (!token) {
      return res.status(401).json({
        message: "Người dùng chưa được xác thực",
        success: false,
      }); 
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET); // giải mã token
    if (!decode) {
      return res.status(401).json({
        message: "Mã thông báo không hợp lệ",
        success: false,
      });
    }

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findById(decode.userId);
    if (!user) {
      return res.status(401).json({
        message: "Người dùng không tồn tại",
        success: false,
      });
    }

    req.id = user._id;
    req.user = user; // Gán thông tin người dùng vào req.user
    next();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
};

export { authenticate, isAdmin };