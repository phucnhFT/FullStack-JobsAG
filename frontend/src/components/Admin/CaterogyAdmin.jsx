import React, { useEffect, useState } from "react";
import axios from "axios";
import { CATEGORY_API } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const fetchCategories = async (page) => {
    try {
      const res = await axios.get(`${CATEGORY_API}/get-categories`, {
        params: { page, limit },
        withCredentials: true,
      });
      if (res.data.success) {
        setCategories(res.data.categories);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy danh sách danh mục");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này không?"
    );
    if (!confirmDelete) return;
    try {
      const res = await axios.delete(
        `${CATEGORY_API}/delete-categories/${categoryId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Xóa danh mục thành công");
        fetchCategories(currentPage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa danh mục");
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCategories(page);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Navbar />
      <h1 className="text-xl md:text-2xl font-bold mb-4 mt-6 md:mt-10">
        Danh sách Danh mục
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal font-medium">
              <th className="py-2 px-4 md:py-3 md:px-6 text-left">
                Tên danh mục
              </th>
              <th className="py-2 px-4 md:py-3 md:px-6 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {categories.map((category) => (
              <motion.tr
                key={category._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-2 px-4 md:py-3 md:px-6">{category.name}</td>
                <td className="py-2 px-4 md:py-3 md:px-6 flex space-x-2">
                  <Button
                    className="bg-red-500 text-white"
                    onClick={() => handleDeleteCategory(category._id)}
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
                ? "bg-blue-500 text-white"
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
