import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API } from "@/utils/constant";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays } from "lucide-react";
import Navbar from "@/components/shared/Navbar";

export default function JobStats() {
  const [stats, setStats] = useState({ total: 0, all: 0 });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchJobStats = async () => {
    try {
      const res = await axios.get(`${JOB_API}/stats/${startDate}/${endDate}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJobStats();
  }, [startDate, endDate]);

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <Navbar />
      <div className="container mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold mb-6 text-gray-800"
        >
          📊 Thống kê Công việc
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Số lượng công việc đã đăng trên hệ thống
          </h2>

          {/* Bộ lọc thời gian */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <CalendarDays
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <span className="text-gray-600">đến</span>

            <div className="relative w-full sm:w-64">
              <CalendarDays
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Biểu đồ */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Tổng", uv: stats.total || 0 },
                { name: "Tất cả", uv: stats.all || 0 },
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uv" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
