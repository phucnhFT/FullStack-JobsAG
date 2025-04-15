import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Navbar from "@/components/shared/Navbar";
import axios from "axios";
import { COMPANY_API } from "@/utils/constant";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import bannerCompany from "../assets/bannerCompany.webp";

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false); // Thêm state xem thêm

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

  const formatNumber = (num) =>
    num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="border border-gray-300 rounded-lg shadow-lg bg-white p-6">
          {/* Banner công ty */}
          <div className="relative h-56 w-full rounded-lg overflow-hidden md:h-64 lg:h-80">
            <img
              src={bannerCompany}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/80 via-green-500/70 to-[#e0ffe0]/60 opacity-90" />

            <div className="absolute bottom-4 left-8 right-8 flex items-start justify-between md:bottom-6 lg:bottom-8">
              <div className="flex items-start space-x-4 md:space-x-6 lg:space-x-8">
                <div className="bg-white p-1 rounded-md shadow-md w-20 h-20 flex items-center justify-center md:w-24 lg:w-28">
                  <img
                    src={company?.logo}
                    alt="Logo"
                    className="w-16 h-16 object-contain md:w-20 lg:w-24"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
                    {company?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm md:text-base lg:text-lg">
                    <span className="bg-yellow-300 text-red-500 px-2 py-0.5 rounded text-xs font-semibold">
                      Công ty chuyên nghiệp
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nội dung chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
            {/* Cột trái */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="font-bold text-lg mb-2">Giới thiệu công ty</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {showMore
                    ? company?.description
                    : company?.description?.slice(0, 300) +
                      (company?.description?.length > 300 ? "..." : "")}
                </p>

                {company?.description?.length > 300 && (
                  <button
                    className="mt-2 text-green-600 font-semibold flex items-center"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "Thu gọn ▲" : "Xem thêm ▼"}
                  </button>
                )}
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

            {/* Cột phải */}
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="font-bold text-lg mb-2">Thông tin liên hệ</h2>
                <p className="text-gray-700">{company?.location}</p>
                <h2 className="font-bold text-lg mt-2">Website: </h2>
                <p
                  className="text-blue-600 underline break-words cursor-pointer"
                  onClick={() => window.open(company?.website, "_blank")}
                >
                  {company?.website}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="font-bold text-lg mb-2">Thông tin công ty</h2>
                <p className="text-gray-700">
                  👥 Nhân viên:{" "}
                  <span className="font-semibold">
                    {formatNumber(company?.employeeCount || 0)}
                  </span>
                </p>
              </div>

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

          {/* Nút quay lại */}
          <div className="flex justify-center mt-8">
            <Button
              className="text-white px-5 py-2 text-sm rounded-lg shadow-md"
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
