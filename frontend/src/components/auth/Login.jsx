import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/userSlice";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading, user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlerInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        toast.success("Đăng nhập thành công !");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mx-auto max-w-7xl px-4">
        <form
          onSubmit={handlerSubmit}
          className="w-full md:w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-medium text-xl mb-5">Đăng nhập</h1>
          <div className="my-2">
            <Label>Email: </Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={handlerInputChange}
              placeholder="abc@gmail.com"
            />
          </div>
          <div className="my-2">
            <Label>Mật khẩu: </Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={handlerInputChange}
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex flex-col md:flex-row items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Ứng Viên"
                  checked={input.role === "Ứng Viên"}
                  onChange={handlerInputChange}
                  className="cursor-pointer size-3"
                />
                <Label
                  htmlFor="r1"
                >
                  Ứng Viên
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Nhà Tuyển Dụng"
                  checked={input.role === "Nhà Tuyển Dụng"}
                  onChange={handlerInputChange}
                  className="cursor-pointer size-3"
                />
                <Label htmlFor="r2">Nhà Tuyển Dụng</Label>
              </div>
            </RadioGroup>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vui lòng đợi...
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Đăng nhập
            </Button>
          )}
          <div className="text-sm flex flex-col md:flex-row justify-between items-center">
            <span>
              Bạn chưa có tài khoản?
              <Link to="/Signup" className="text-blue-600">
                Đăng ký
              </Link>
            </span>
            <Link to="/forgot-Password" className="text-blue-600">
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}