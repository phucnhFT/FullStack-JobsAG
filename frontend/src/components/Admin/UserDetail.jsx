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

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-48 relative">
            <div className="absolute inset-x-0 -bottom-16 flex justify-center">
              <Avatar className="size-32 border-4 border-white shadow-lg">
                <AvatarImage
                  src={user?.profile?.profilePhoto || "/default-avatar.png"}
                  alt={user?.fullname}
                />
              </Avatar>
            </div>
          </div>

          {/* Thông tin người dùng */}
          <div className="pt-24 pb-10 px-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.fullname || "Tên người dùng"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {/* Vai trò */}
              <div className="bg-gray-50 rounded-xl p-5 shadow hover:shadow-md transition">
                <h2 className="text-gray-600 font-semibold mb-2">Vai trò</h2>
                <p className="text-gray-800">{user?.role || "Chưa có"}</p>
              </div>

              {/* Số điện thoại */}
              <div className="bg-gray-50 rounded-xl p-5 shadow hover:shadow-md transition">
                <h2 className="text-gray-600 font-semibold mb-2">
                  Số điện thoại
                </h2>
                <p className="text-gray-800">
                  {user?.phoneNumber || "Chưa có"}
                </p>
              </div>

              {/* CV */}
              <div className="bg-gray-50 rounded-xl p-5 shadow hover:shadow-md transition sm:col-span-2">
                <h2 className="text-gray-600 font-semibold mb-2">
                  📄 CV của người dùng
                </h2>
                {user?.profile?.resume ? (
                  <a
                    href={user?.profile?.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    {user?.profile?.resumeOriginalName ||
                      "Xem CV"}
                  </a>
                ) : (
                  <p className="text-gray-800">N/A</p>
                )}
              </div>
            </div>
          </div>

          {/* Nút quay lại */}
          <div className="px-6 pb-10 flex justify-center">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-full shadow transition"
              onClick={() => window.history.back()}
            >
              ← Quay lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
