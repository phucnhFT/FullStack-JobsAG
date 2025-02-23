import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này không?"
    );
    if (!confirmDelete) return;
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
  };

  useEffect(() => {
    fetchUsers(currentPage);
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
                        <Button className="bg-blue-500 text-white">
                          Xem chi tiết
                        </Button>
                      </Link>
                      <Button
                        className="bg-red-500 text-white"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Xóa
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
                        <Button className=" bg-[#2a21a8]">Xem chi tiết</Button>
                      </Link>
                      <Button
                        className="bg-red-500 text-white"
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
    </div>
  );
}
