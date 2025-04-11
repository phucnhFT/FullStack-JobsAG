import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API } from "@/utils/constant";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
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

export default function JobStats() {
  const [stats, setStats] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    total: 0,
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [otherCompanyStats, setOtherCompanyStats] = useState([]);

  // Hàm để lấy thống kê công việc
  const fetchJobStats = async () => {
    try {
      const res = await axios.get(
        `${JOB_API}/stats/${year}/${month}/${day}/${companyId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setStats(res.data.stats);
        setCompanyName(res.data.company);
        setOtherCompanyStats(res.data.otherCompanyStats);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const handleCompanyIdChange = (e) => {
    setCompanyId(e.target.value);
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${JOB_API}/companies`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy danh sách công ty");
    }
  };

  useEffect(() => {
    fetchJobStats();
    fetchCompanies(); // Gọi hàm khi component được mount
  }, [year, month, day, companyId]);

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 mt-10">Thống kê Công việc</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">
          Số lượng công việc đã đăng trên hệ thống
        </h2>
        <div className="flex justify-between mb-4">
          <div>
            <label>Năm:</label>
            <select value={year} onChange={handleYearChange}>
              {Array.from({ length: 10 }, (_, i) => 2024 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tháng:</label>
            <select value={month} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Ngày:</label>
            <select value={day} onChange={handleDayChange}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            {companies && companies.length > 0 ? (
              <select value={companyId} onChange={handleCompanyIdChange}>
                <option value="">Chọn công ty</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            ) : (
              <p>Không có công ty nào</p>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: "Ngày", uv: stats.daily || 0 },
              { name: "Tháng", uv: stats.monthly || 0 },
              { name: "Năm", uv: stats.yearly || 0 },
              { name: "Tổng", uv: stats.total || 0 },
            ]}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, "dataMax"]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="uv" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <h2 className="text-lg font-semibold">
          Số lượng công việc đã đăng của công ty {companyName}
        </h2>
        {otherCompanyStats && otherCompanyStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={otherCompanyStats.map((stat, index) => ({
                name: `Công ty ${index + 1}`,
                uv: stat,
              }))}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, "dataMax"]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Không có dữ liệu công việc cho công ty khác</p>
        )}
      </div>
    </div>
  );
}
