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
  DialogTitle,
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
        } else {
          Swal.fire({
            title: "Lỗi",
            text: res.data.message,
            icon: "error",
          });
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
    <div className="container mx-auto px-4 md:px-8 py-6">
      <Navbar />
      <div className="flex items-center justify-between mb-6 mt-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Danh sách Người dùng
        </h1>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-[#2a21a8] hover:bg-[#1e1a87] text-white"
        >
          + Thêm mới
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-1/2 py-2 pl-4 text-sm border-gray-300 focus:ring-[#2a21a8] focus:border-[#2a21a8]"
        />
        <div className="text-sm text-gray-600 font-medium">
          <Label className="font-medium">Tổng:</Label> {totalApplicants} Ứng
          viên, {totalEmployers} Nhà tuyển dụng
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">Avatar</th>
              <th className="py-3 px-4 text-left">Họ & Tên</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
            {(searchTerm ? filteredUsers : users).map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <Avatar>
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="avatar"
                    />
                  </Avatar>
                </td>
                <td className="py-3 px-4">{user.fullname}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4 space-x-2">
                  <Link to={`/admin/users/${user._id}`}>
                    <Button size="sm" variant="outline">
                      Xem
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate(user)}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Xóa
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-4 py-2 rounded-md text-sm ${
              currentPage === index + 1
                ? "bg-[#2a21a8] text-white"
                : "bg-gray-200 text-gray-800"
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
                    id="admin"
                    name="role"
                    value="Admin"
                    checked={role === "Admin"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <Label className="ml-2 text-sm text-gray-600" htmlFor="admin">
                    Admin
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
