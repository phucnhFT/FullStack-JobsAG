import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";

export default function AdminUserDetail() {
  const [user, setUser] = useState({});
  const { userId } = useParams();

  const fetchUser = async () => {
    try {
      if (!userId) {
        toast.error("Lỗi khi lấy thông tin người dùng");
        return;
      }
      const res = await axios.get(`${USER_API}/get-detail/${userId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy thông tin người dùng");
    }
  };

  useEffect(() => {
    if (!userId) {
      toast.error("Lỗi khi lấy thông tin người dùng");
      return;
    }
    fetchUser();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 mt-6 md:mt-10 text-center">
        Thông tin người dùng
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="w-full md:w-1/2">
          <div className="bg-white shadow-md rounded-lg p-4">
            <Avatar className="cursor-pointer size-40 mx-auto">
              <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
            </Avatar>
            <h2 className="text-lg font-bold mb-2">Họ & Tên:</h2>
            <p className="text-gray-600 my-2">{user.fullname}</p>
            <h2 className="text-lg font-bold mb-2">Email:</h2>
            <p className="text-gray-600 my-2">{user.email}</p>
            <h2 className="text-lg font-bold mb-2">Role:</h2>
            <p className="text-gray-600 my-2">{user.role}</p>
            <h2 className="text-lg font-bold mb-2">Số điện thoại:</h2>
            <p className="text-gray-600 my-2">{user.phoneNumber}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={() => window.history.back()}>Quay lại</Button>
      </div>
    </div>
  );
}
