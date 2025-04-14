import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Navbar from "@/components/shared/Navbar";
import axios from "axios";
import { COMPANY_API, USER_API } from "@/utils/constant";
import { useParams, useNavigate } from "react-router-dom";

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState({});
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`${COMPANY_API}/get-details/${id}`);
        setCompany(response.data.companyDetail);
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu công ty", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);


  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  const formatNumber = (num) =>
    num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 bg-white">
        {/* bìa */}
        <div className="bg-gray-700 h-40 w-full rounded-lg flex items-center justify-center relative">
          <div className="absolute left-8 bottom-[-30px] bg-white p-2 rounded shadow">
            <img
              src={company?.logo}
              alt="logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-white text-2xl font-semibold">{company?.name}</h1>
        </div>

        {/* thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* side trái */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">Giới thiệu công ty</h2>
              <p className="text-gray-700">{company?.description}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">Tuyển dụng</h2>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="border border-gray-300 p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-green-700">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {job.jobType} • {job.createdAt.slice(0, 10)}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="text-blue-600 font-semibold">
                        {formatNumber(job.salary)} VND
                      </span>
                      <Button
                        className="ml-4 text-white text-sm"
                        onClick={() => navigate(`/description/${job._id}`)}
                      >
                        Chi tiết công việc
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* side phải */}
          <div className="space-y-4">
            {/* Liên hệ */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">Thông tin liên hệ</h2>
              <p className="text-gray-700">{company?.location}</p>
              <p
                className="text-blue-600 underline break-words mt-2 cursor-pointer"
                onClick={() => window.open(company?.website, "_blank")}
              >
                {company?.website}
              </p>
            </div>

            {/* Thông tin mở rộng */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">Thông tin công ty</h2>
              <p className="text-gray-700">
                👥 Nhân viên:{" "}
                <span className="font-semibold">
                  {formatNumber(company?.employeeCount || 0)}
                </span>
              </p>
            </div>

            {/* Bản đồ */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">Xem bản đồ</h2>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  company?.location
                )}&z=15&output=embed`}
                width="100%"
                height="200"
                className="rounded-lg border"
                allowFullScreen=""
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            className="text-white px-5 py-2 text-sm rounded-lg shadow-md"
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </div>
      </div>
    </>
  );
}
