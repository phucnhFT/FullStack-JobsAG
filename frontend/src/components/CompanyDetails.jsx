import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Navbar from "@/components/shared/Navbar";
import axios from "axios";
import { COMPANY_API} from "@/utils/constant";
import { useParams } from "react-router-dom";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-5 px-6 py-6 bg-white border border-gray-300 shadow-lg rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={company?.logo} alt="Company Logo" />
          </Avatar>
          <h1 className="font-bold text-xl">{company?.name}</h1>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="font-semibold">Mô tả:</Label>
            <p className="text-sm text-gray-600">{company?.description}</p>
          </div>
          <div>
            <Label className="font-semibold">Địa chỉ:</Label>
            <p className="text-sm text-gray-600">{company?.location}</p>
          </div>
          <div>
            <Label className="font-semibold">Website:</Label>
            <p
              className="text-sm text-blue-600 underline cursor-pointer"
              onClick={() => window.open(company?.website, "_blank")}
            >
              {company?.website}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto w-full mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border border-gray-300">
                <th
                  className="py-2 px-4 text-center font-semibold border border-gray-300"
                  style={{ width: "25%" }}
                >
                  Tên công việc
                </th>
                <th
                  className="py-2 px-4 text-center font-semibold border border-gray-300"
                  style={{ width: "25%" }}
                >
                  Loại công việc
                </th>
                <th
                  className="py-2 px-4 text-center font-semibold border border-gray-300"
                  style={{ width: "25%" }}
                >
                  Mức lương
                </th>
                <th
                  className="py-2 px-4 text-center font-semibold border border-gray-300"
                  style={{ width: "25%" }}
                >
                  Ngày đăng tuyển
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border border-gray-300">
                  <td
                    className="py-3 px-4 text-center border border-gray-300 whitespace-nowrap"
                    style={{ width: "25%" }}
                  >
                    {job.title}
                  </td>
                  <td
                    className="py-3 px-4 text-center border border-gray-300"
                    style={{ width: "25%" }}
                  >
                    {job.jobType}
                  </td>
                  <td
                    className="py-3 px-4 text-center border border-gray-300"
                    style={{ width: "25%" }}
                  >
                    {formatNumber(job.salary)} VND
                  </td>
                  <td
                    className="py-3 px-4 text-center border border-gray-300"
                    style={{ width: "25%" }}
                  >
                    {job.createdAt.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-5">
          <Button
            className="bg-[#7209b7] text-white px-5 py-2 text-sm rounded-lg shadow-md"
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </div>
      </div>
    </>
  );
}
