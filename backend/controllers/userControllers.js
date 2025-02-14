import { User } from "../models/userModel.js";
import { Company } from "../models/companyModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../config/datauri.js";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../config/sendMail.js";

//tạo tài khoản
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ các trường !",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email này đã tồn tại",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      newUser,
    });
  } catch (error) {
    res.status(404).json({ message: error });
    console.log(error);
  }
};

//đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ các trường !",
        success: false,
      });
    }

    // Kiểm tra email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email hoặc mật khẩu không chính xác",
        success: false,
      });
    }

    // Kiểm tra mật khẩu
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({
        message: "Mật khẩu không chính xác",
        success: false,
      });
    }

    // Nếu người dùng là Admin, không cần kiểm tra vai trò
    if (user.role === "Admin") {
      const tokenData = {
        userId: user._id,
      };

      const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Dữ liệu trả về cho client
      user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      };

      return res
        .status(200)
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000, // Thời gian tồn tại là 1 ngày
          httpOnly: true, // Cookies chỉ được gửi qua https
          sameSite: "strict", // Cookies chỉ được gửi cùng tên miền
        })
        .json({
          success: true,
          message: `Xin Chào ${user.fullname}`,
          user,
        });
    }

    // Nếu không phải Admin, kiểm tra vai trò
    const { role } = req.body;
    if (role !== user.role) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại với vai trò hiện tại.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Dữ liệu trả về cho client
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // Thời gian tồn tại là 1 ngày
        httpOnly: true, // Cookies chỉ được gửi qua https
        sameSite: "strict", // Cookies chỉ được gửi cùng tên miền
      })
      .json({
        success: true,
        message: `Xin Chào ${user.fullname}`,
        user,
      });
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
};

//đăng xuất
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Đăng xuất thành công.",
    });
  } catch (error) {
    res.status(500).json({ message: err });
    console.log(error);
  }
};

//update profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(","); //tách chuỗi skills thành 1 mảng nếu cung cấp
    }
    const userId = req.id; // middle
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "Người dùng không tồn tại",
        success: false,
      });
    }
    // cập nhật dữ liệu
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    //sơ yếu lý lịch sẽ được gửi sau ở đây...
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname; 
    }


    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      success: true,
      message: "Cập nhật thành công !",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Vui lòng cung cấp email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email không tồn tại trong hệ thống" });
    }

    // Tạo reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Lưu token và thời gian hết hạn vào database
    await User.findByIdAndUpdate(
      user._id,
      {
        resetToken: resetToken,
        resetTokenExpire: Date.now() + 3600000, // 1 giờ
      },
      { new: true }
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const emailText = `Vui lòng nhấn vào liên kết sau để đặt lại mật khẩu: \n\n ${resetLink}`;

    // Gửi email
    await sendEmail(user.email, "Khôi phục mật khẩu", emailText);
    console.log("Reset password email sent:", resetLink);
    return res
      .status(200)
      .json({ success: true, message: "Email khôi phục đã được gửi!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lỗi khi gửi email, vui lòng thử lại sau" });
  }
};

//đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decodeToken.id,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    //ma hoa mat khau moi -> save db
    const passwordNew = await bcrypt.hash(password, 10);
    user.password = passwordNew;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();
    res.status(200).json({ message: "cập nhật mật khẩu thành công" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Lỗi khi đặt lại mật khẩu" });
  }
};

//add công ty vào danh sách quan tâm của người dùng
export const addInterestedCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const userId = req.id;

    //kiem tra cong viec co ton tai hay khong
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Công ty không tồn tại" });
    }

    //kiem tra xem user da quan tâm den cong viec nay chua
    const user = await User.findById(userId);
    if (user.interestedCompanies.includes(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Công ty này đã có trong danh sách quan tâm của bạn!",
      });
    }
    //thêm công việc vào danh sách quan tâm
    user.interestedCompanies.push(companyId);
    await user.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Thêm công ty vào danh sách quan tâm thành công!",
      });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Lỗi khi thêm công ty vào danh sách quan tâm" });
  }
};

//xoá công ty khỏi danh sách theo dõi
export const removeInterestedCompany = async (req, res) => {
  try {
    const { companyId } = req.params; // Lấy ID công ty từ URL
    const userId = req.id; // Lấy ID người dùng từ JWT

    // Kiểm tra người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Kiểm tra công ty có nằm trong danh sách quan tâm không
    if (!user.interestedCompanies.includes(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Công ty không nằm trong danh sách quan tâm",
      });
    }

    // Xóa công ty khỏi danh sách
    user.interestedCompanies = user.interestedCompanies.filter(
      (id) => id.toString() !== companyId
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Xóa công ty khỏi danh sách quan tâm thành công",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa công ty khỏi danh sách quan tâm",
    });
  }
};


//xem danh sách công ty đã quan tâm
export const getInterestedCompany = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate("interestedCompanies");
    if(!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    const interestedCompany = user.interestedCompanies

    return res.status(200).json({
      success: true,
      message: "Danh sách các công ty quan tâm",
      companies: interestedCompany,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi khi xem danh sách quan tâm" });
  }
};


//admin
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const limit = parseInt(req.query.limit) || 10; // Số lượng người dùng trên mỗi trang

    const users = await User.find()
      .skip((page - 1) * limit) // Bỏ qua số lượng người dùng đã được hiển thị
      .limit(limit); // Giới hạn số lượng người dùng trả về

    const totalUsers = await User.countDocuments(); // Tổng số người dùng
    const totalPages = Math.ceil(totalUsers / limit); // Tổng số trang

    return res.status(200).json({
      success: true,
      users,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)

    if(!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      })
    }
    return res.status(200).json({
      success: true,
      message: "Xoá người dùng thành công",
    })
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lỗi xoá người dùng" });
  }
}


