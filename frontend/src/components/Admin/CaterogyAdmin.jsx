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
    <div className="container mx-auto p-4 md:p-6">
      <Navbar />
      <h1 className="text-2xl md:text-3xl font-bold mb-6 mt-6 md:mt-10 text-gray-800">
        Danh sách Danh mục
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal font-medium">
              <th className="py-3 px-6 text-left">Tên danh mục</th>
              <th className="py-3 px-6 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {categories.map((category) => (
              <motion.tr
                key={category._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-6">{category.name}</td>
                <td className="py-3 px-6 flex space-x-3">
                  <Button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-white transition-colors"
                  >
                    Xóa
                  </Button>

                  <Button
                    onClick={() => handleViewCategoryDetail(category._id)}
                    className="text-white transition-colors"
                  >
                    Xem chi tiết
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination mt-6 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-semibold ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            } transition-colors`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isDialogOpen && categoryDetail.category && categoryDetail.jobDetails && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-3/4 md:w-1/2 my-2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Thông tin chi tiết danh mục
            </h2>
            <Label className="text-lg font-medium text-gray-700">
              Tên danh mục: {categoryDetail.category.name}
            </Label>
            <h3 className="text-xl font-semibold mb-4 mt-6 text-gray-800">
              Danh sách công việc
            </h3>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal font-medium">
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
            <div className="mt-6 flex justify-center">
              {Array.from(
                { length: Math.ceil(categoryDetail.jobDetails.length / 10) },
                (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`mx-1 px-4 py-2 rounded-lg text-sm font-semibold ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    } transition-colors`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-500 text-white hover:bg-gray-600 transition-colors"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
