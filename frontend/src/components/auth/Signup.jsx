import Navbar from '@/components/shared/Navbar'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup } from "@/components/ui/radio-group";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser  } from "@/redux/userSlice";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const { loading, user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handlerInputChange = (e) => {
    setInput({...input, [e.target.name]: e.target.value });
  };
  const handlerFileChange = (e) => {
    setInput({...input, file: e.target.files?.[0] });
  }
  const handlerSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("fullname", input.fullname)
    formData.append("email", input.email)
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if(input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API}/register`, formData, {
        headers: {
          'Content-Type':'multipart/form-data'
        },
        withCredentials: true
      });
      if(res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        toast.success("Đăng ký thành công!", res.data.message);
      }

    } catch(err) {
      console.log(err)
      toast.error(err.response.data.message);
    } finally {
       dispatch(setLoading(false));
    }
  }

useEffect(() => {
  if (user) {
    navigate("/");
  }
}, []);
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mx-auto max-w-7xl px-4">
        <form
          onSubmit={handlerSubmit}
          className="w-full md:w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-medium text-xl mb-5">Đăng ký</h1>
          <div className="my-2">
            <Label>Họ & Tên: </Label>
            <Input
              type="text value={input.fullname}"
              name="fullname"
              onChange={handlerInputChange}
              placeholder="Nhập họ và tên"
            />
          </div>
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
            <Label>Số điện thoại: </Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={handlerInputChange}
              placeholder="Số điện thoại"
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
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Ứng Viên"
                  checked={input.role === "Ứng Viên"}
                  onChange={handlerInputChange}
                  className="cursor-pointer size-3"
                />
                <Label htmlFor="r1">Ứng Viên</Label>
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
            <div className="flex items-center gap-2">
              <Label>Hồ sơ</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={handlerFileChange}
                className="cursor-pointer"
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vui lòng đợi...
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Đăng Ký
            </Button>
          )}
          <span className="text-sm">
            Bạn Đã có tài khoản?
            <Link to="/login" className="text-blue-600">
              Đăng nhập
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}