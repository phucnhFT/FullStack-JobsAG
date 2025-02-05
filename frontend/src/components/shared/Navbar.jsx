import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@/components/ui/popover";
import { AvatarImage } from "@radix-ui/react-avatar";
import { LogOut, User2, Menu } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/userSlice";

export default function Navbar() {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold">
              Jobs<span className="text-[#2a21a8]">AG</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-12">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <ul
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row font-medium items-center gap-5 cursor-pointer absolute md:static top-16 left-0 right-0 bg-white z-50 p-4 md:p-0`}
          >
            {user && user.role === "Nhà Tuyển Dụng" ? (
              <>
                <li>
                  <Link to="/employer/companies">Công ty</Link>
                </li>
                <li>
                  <Link to="/employer/jobs">Công việc</Link>
                </li>
              </>
            ) : user && user.role === "Admin" ? (
              <>
                <li>
                  <Link to="/admin/users">Quản lý Người dùng</Link>
                </li>
                <li>
                  <Link to="/admin/jobs">Quản lý Công việc</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Trang chủ</Link>
                </li>
                <li>
                  <Link to="/jobs">Công việc</Link>
                </li>
                <li>
                  <Link to="/browse">Trình duyệt</Link>
                </li>
                <li>
                  <Link to="/interested-companies">
                    <span className="text-black flex items-center gap-1">
                      Đang theo dõi
                    </span>
                  </Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Đăng nhập</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#b91c1c] hover:bg-[#b91c1c]">
                  Đăng ký
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <div className="flex gap-4 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="@shadcn"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 text-gray-600">
                    {user && user.role === "Ứng Viên" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <User2 />
                        <Button variant="link">
                          <Link to="/profile">Xem hồ sơ</Link>
                        </Button>
                      </div>
                    )}
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut />
                      <Button onClick={handleLogout} variant="link">
                        Đăng xuất
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}
