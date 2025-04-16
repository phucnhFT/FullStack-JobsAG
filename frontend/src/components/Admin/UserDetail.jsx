import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
    fetchUser();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 h-32 relative">
            <div className="absolute inset-x-0 -bottom-12 flex justify-center">
              <Avatar className="size-24 border-4 border-white shadow-md">
                <AvatarImage
                  src={user?.profile?.profilePhoto}
                  alt={user?.fullname}
                />
              </Avatar>
            </div>
          </div>

          <div className="pt-20 pb-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.fullname}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            <div className="flex justify-center items-center gap-12 mt-6">
              <div className="text-center border px-4 py-2 rounded-md shadow-sm">
                <h2 className="text-gray-600 font-semibold">Vai trò</h2>
                <p className="text-gray-800">{user?.role || "Chưa có"}</p>
              </div>
              <div className="text-center border px-4 py-2 rounded-md shadow-sm">
                <h2 className="text-gray-600 font-semibold">Số điện thoại</h2>
                <p className="text-gray-800">
                  {user?.phoneNumber || "Chưa có"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex justify-center">
            <Button
              className="text-white px-6"
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
