import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API } from "@/utils/constant";
import { setLoading } from "@/redux/userSlice";
import { useDispatch } from "react-redux";

export default function ResetPassword() {
  const { token } = useParams(); // Lấy token từ URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra xem mật khẩu và mật khẩu xác nhận có khớp không
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      dispatch(setLoading(true)); // Set loading state
      const res = await axios.post(`${USER_API}/reset-password/${token}`,{ password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Gửi cookies nếu có
        }
      );

      if (res.data.success) {
        navigate("/login"); // Điều hướng đến trang đăng nhập sau khi reset mật khẩu thành công
        toast.success(res.data.message);
      }

      setError("");
    } catch (err) {
      setError(err.response.data?.message);
      toast.error(err.response.data?.message);
    } finally {
      dispatch(setLoading(false)); // Hủy loading state
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 border border-gray-200 rounded-md p-6 my-10 shadow-md"
        >
          <h1 className="font-semibold text-2xl mb-6 text-center">
            Đặt lại mật khẩu
          </h1>

          <div className="my-4">
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Mật khẩu mới:
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="my-4">
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Xác nhận mật khẩu:
            </Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium py-2 rounded-md transition duration-300"
          >
            Đặt lại mật khẩu
          </Button>

          <span className="text-sm block text-center mt-4">
            Quay lại{" "}
            <Link
              to="/Login"
              className="text-blue-600 hover:underline transition duration-200"
            >
              Đăng nhập
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}
