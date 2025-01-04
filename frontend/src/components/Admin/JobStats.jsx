import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API } from "@/utils/constant";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";

const JobStats = () => {
  const [stats, setStats] = useState({ weekly: 0, monthly: 0, yearly: 0 });

  // Hàm để lấy thống kê công việc
  const fetchJobStats = async () => {
    try {
      const res = await axios.get(`${JOB_API}/stats`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy thống kê công việc");
    }
  };

  useEffect(() => {
    fetchJobStats(); // Gọi hàm khi component được mount
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 mt-10">Thống kê Công việc</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">
          Số lượng công việc đã đăng trên hệ thống
        </h2>
        <ul className="list-disc pl-5">
          <motion.li
            initial={{ opacity: 0, y: 20 }} // Hiệu ứng khởi đầu
            animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện
            exit={{ opacity: 0, y: -20 }} // Hiệu ứng khi rời khỏi
            transition={{ duration: 0.5 }} // Thời gian chuyển động
          >
            Trong tuần: {stats.weekly}
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 20 }} // Hiệu ứng khởi đầu
            animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện
            exit={{ opacity: 0, y: -20 }} // Hiệu ứng khi rời khỏi
            transition={{ duration: 0.5 }} // Thời gian chuyển động
          >
            Trong tháng: {stats.monthly}
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 20 }} // Hiệu ứng khởi đầu
            animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện
            exit={{ opacity: 0, y: -20 }} // Hiệu ứng khi rời khỏi
            transition={{ duration: 0.5 }} // Thời gian chuyển động
          >
            Trong năm: {stats.yearly}
          </motion.li>
        </ul>
      </div>
    </div>
  );
};

export default JobStats;
