import React, { useEffect, useState } from "react";
import axios from "axios";
import { CATEGORY_API } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const [categoryDetail, setCategoryDetail] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //lấy danh sách
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
    const confirmDelete = await Swal.fire({
      title: "Xóa danh mục?",
      text: "Bạn có chắc chắn muốn xóa danh mục này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
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
    }
  };

  const handleViewCategoryDetail = async (categoryId) => {
    try {
      const res = await axios.get(`${CATEGORY_API}/categories/${categoryId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCategoryDetail(res.data);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy thông tin chi tiết danh mục");
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
    <div className="container mx-auto px-4 md:px-8 py-6">
      <Navbar />

      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Danh sách Danh mục
        </h1>

        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-blue-100 text-blue-700 uppercase text-sm font-semibold">
                <th className="py-3 px-6 text-left">Tên danh mục</th>
                <th className="py-3 px-6 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-medium">
              {categories.map((category) => (
                <motion.tr
                  key={category._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{category.name}</td>
                  <td className="py-3 px-6 flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleDeleteCategory(category._id)}
                      size="sm"
                      variant="destructive"
                    >
                      Xóa
                    </Button>
                    <Button
                      onClick={() => handleViewCategoryDetail(category._id)}
                      size="sm"
                      variant="outline"
                    >
                      Xem chi tiết
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Chi tiết danh mục */}
        {isDialogOpen &&
          categoryDetail.category &&
          categoryDetail.jobDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] md:w-[60%] max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Thông tin chi tiết danh mục
                </h2>

                <Label className="block text-lg font-medium text-gray-700 mb-2">
                  Tên danh mục:{" "}
                  <span className="font-semibold">
                    {categoryDetail.category.name}
                  </span>
                </Label>

                <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800">
                  📋 Danh sách công việc
                </h3>

                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-medium">
                      <th className="py-3 px-6 text-left">Tên công việc</th>
                      <th className="py-3 px-6 text-left">Số ứng viên</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-medium">
                    {categoryDetail.jobDetails
                      .slice((currentPage - 1) * 10, currentPage * 10)
                      .map((job) => (
                        <tr
                          key={job.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-3 px-6">{job.jobName}</td>
                          <td className="py-3 px-6">{job.applicantCount}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Phân trang trong modal */}
                <div className="mt-6 flex justify-center gap-2 flex-wrap">
                  {Array.from(
                    {
                      length: Math.ceil(categoryDetail.jobDetails.length / 10),
                    },
                    (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                          currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
