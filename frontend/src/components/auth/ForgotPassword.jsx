import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/userSlice";
import { USER_API } from "@/utils/constant";
import { toast } from "sonner"; // Import toast từ sonner

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true)); // Bật trạng thái loading
    setMessage("");
    setError("");

    try {
      const res = await axios.post(`${USER_API}/forgot-password`,{ email },{
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      setMessage(res.data.message);
      toast.success(res.data.message);
    } catch (err) {
      setMessage("");
      setError(err.response.data?.message);
      toast.error(err.response.data?.message);
    } finally {
      dispatch(setLoading(false)); // Tắt trạng thái loading
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mx-auto max-w-7xl">
        <form
          onSubmit={handleSubmit}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-medium text-xl mb-5">Quên mật khẩu</h1>
          {/* Nhập Email */}
          <div className="my-2">
            <Label>Email của bạn:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              required
            />
          </div>

          {/* Button Submit */}
          <Button type="submit" className="w-full my-4" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Vui lòng chờ...
              </>
            ) : (
              "Gửi liên kết đặt lại mật khẩu"
            )}
          </Button>

          {/* Chuyển đến trang Đăng nhập */}
          <span className="text-sm">
            Nhớ mật khẩu?{" "}
            <Link to="/Login" className="text-blue-600">
              Đăng nhập
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}
