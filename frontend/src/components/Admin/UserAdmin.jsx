import React, { useState, useEffect } from "react";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTitle ,
  DialogContent,
  DialogHeader, 
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AdminUsers() {
  const limit = 10;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalEmployers, setTotalEmployers] = useState(0);

  const fetchUsers = async (page) => {
    try {
      const res = await axios.get(`${USER_API}/get-users`, {
        params: { page, limit },
        withCredentials: true,
      });
      if (res.data.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy danh sách người dùng");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = await Swal.fire({
      title: "Xóa người dùng?",
      text: "Bạn có chắc chắn muốn xóa người dùng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const res = await axios.delete(`${USER_API}/delete-user/${userId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success("Xóa người dùng thành công");
          fetchUsers(currentPage);
        }
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi xóa người dùng");
      }
    }
  };

  //thêm người dùng
  const handleAddUser = async () => {
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("phoneNumber", phone);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("file", avatar);

      const res = await axios.post(`${USER_API}/add-user`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Thêm người dùng thành công");
        fetchUsers(currentPage);
        setIsOpen(false);
        setFullname("");
        setEmail("");
        setPhone("");
        setPassword("");
        setRole("");
        setAvatar(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thêm người dùng");
    }
  };
  //cập nhật
  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("phoneNumber", phone);
      if (avatar) formData.append("file", avatar);

      const res = await axios.put(
        `${USER_API}/update-user/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Cập nhật người dùng thành công");
        fetchUsers(currentPage);
        setIsUpdateOpen(false);
        setFullname("");
        setEmail("");
        setPhone("");
        setAvatar(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật người dùng");
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const res = await axios.get(`${USER_API}/get-total-users`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setTotalApplicants(res.data.totalApplicants);
        setTotalEmployers(res.data.totalEmployers);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy tổng số người dùng");
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    fetchTotalUsers();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredUsers = users.filter((user) =>
      user.fullname.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  };

  const handleUpdate = (user) => {
    setIsUpdateOpen(true);
    setSelectedUser(user);
    setFullname(user.fullname);
    setEmail(user.email);
    setPhone(user.phoneNumber);
    setRole(user.role);
    setAvatar(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Navbar />
      <h1 className="text-xl md:text-2xl font-bold mb-4 mt-6 md:mt-10">
        Danh sách Người dùng
      </h1>
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Tìm kiếm người dùng"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-1/2 py-2 pl-10 text-sm text-gray-700"
        />
        <p class="border border-gray-400 p-2 text-center">
          <Label>Tổng: </Label>
          {totalApplicants} ứng viên, {totalEmployers} nhà tuyển dụng
        </p>
        <Button onClick={() => setIsOpen(true)}>Thêm mới</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal font-medium">
              <th className="py-2 px-4 md:py-3 md:px-6 text-left">Avatar</th>
              <th className="py-2 px-4 md:py-3 md:px-6 text-left">Họ & Tên</th>
              <th className="py-2 px-4 md:py-3 md:px-6 text-left">Role</th>
              <th className="py-2 px-4 md:py-3 md:px-6 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {searchTerm
              ? filteredUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2 px-4 md:py-3 md:px-6">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt="@shadcn"
                        />
                      </Avatar>
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6">
                      {user.fullname}
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6">{user.role}</td>
                    <td className="py-2 px-4 md:py-3 md:px-6 flex space-x-2">
                      <Link to={`/admin/users/${user._id}`}>
                        <Button>Xem chi tiết</Button>
                      </Link>
                      <Button onClick={() => handleDeleteUser(user._id)}>
                        Xóa
                      </Button>
                      <Button onClick={() => handleUpdate(user)}>
                        Cập nhật
                      </Button>
                    </td>
                  </motion.tr>
                ))
              : users.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2 px-4 md:py-3 md:px-6">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt="@shadcn"
                        />
                      </Avatar>
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6">
                      {user.fullname}
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6">{user.role}</td>
                    <td className="py-2 px-4 md:py-3 md:px-6 flex space-x-2">
                      <Link to={`/admin/users/${user._id}`}>
                        <Button>Xem chi tiết</Button>
                      </Link>
                      <Button onClick={() => handleDeleteUser(user._id)}>
                        Xóa
                      </Button>
                      <Button onClick={() => handleUpdate(user)}>
                        Cập nhật
                      </Button>
                    </td>
                  </motion.tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="pagination mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 ${
              currentPage === index + 1
                ? "bg-[#2a21a8] text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      {/* Thêm */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm người dùng</DialogTitle>
          </DialogHeader>
          <form>
            <div className="my-2">
              <Label>Họ và tên</Label>
              <Input
                type="text"
                placeholder="Họ và tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>
            <div className="my-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>
            <div className="my-2">
              <Label>Số điện thoại</Label>
              <Input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>
            <div className="my-2">
              <Label>Mật khẩu</Label>
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>
            <div className="my-2">
              <Label>Ảnh đại diện</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>

            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </Label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="applicant"
                    name="role"
                    value="Ứng Viên"
                    checked={role === "Ứng Viên"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <Label
                    className="ml-2 text-sm text-gray-600"
                    htmlFor="applicant"
                  >
                    Ứng Viên
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="employer"
                    name="role"
                    value="Nhà Tuyển Dụng"
                    checked={role === "Nhà Tuyển Dụng"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <Label
                    className="ml-2 text-sm text-gray-600"
                    htmlFor="employer"
                  >
                    Nhà Tuyển Dụng
                  </Label>
                </div>
              </div>
            </div>
            {/* Thêm */}
            <DialogFooter>
              <Button type="button" onClick={handleAddUser}>
                Thêm người dùng
              </Button>
              <DialogClose asChild>
                <Button className="bg-gray-300">Hủy</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Cập nhật */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật người dùng</DialogTitle>
          </DialogHeader>
          <form>
            <div className="my-2">
              <Label>Họ tên</Label>
              <Input
                type="text"
                placeholder="Họ và tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>
            <div className="my-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>
            <div className="my-2">
              <Label>Số điện thoại</Label>
              <Input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>
            <div className="my-2">
              <Label>Ảnh đại diện</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="w-full py-2 text-sm text-gray-700 mb-4"
              />
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleUpdateUser}>
                Cập nhật người dùng
              </Button>
              <DialogClose asChild>
                <Button className="bg-gray-300">Hủy</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
