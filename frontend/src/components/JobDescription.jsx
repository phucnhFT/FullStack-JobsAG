import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/JobSlice.js";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { APPLICANTS_API, JOB_API } from "@/utils/constant";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function JobDescription() {
  const { singleJob } = useSelector(store=> store.job);
  const { user } = useSelector(store=>store.user);
  const [isExpired, setIsExpired] = useState(false); 
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const handlerApplyJob = async () => {
    try {
      const res = await axios.get(`${APPLICANTS_API}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API}/get-job/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          // check công việc đã hết hạn
          const currentDate = new Date();
          const expiryDate = new Date(res.data.job.expiryDate);
          setIsExpired(expiryDate < currentDate); // update trạng thái hết hạn
        } else {
          toast.error("Lỗi khi lấy thông tin công việc");
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);
  
  // format vnd
   const formatNumber = (num) => {
     if (typeof num !== "number") {
       return "Không có dữ liệu";
     }
     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1">
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Badge className={"text-blue-700 font-bold"} variant="ghost">
                {singleJob?.position} Vị trí
              </Badge>
              <Badge className={"text-[#F83002] font-bold"} variant="ghost">
                {singleJob?.jobType}
              </Badge>
              <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
                {formatNumber(singleJob?.salary)} VND
              </Badge>
            </div>
          </div>
          {isExpired ? (
            <span className="text-red-500 mt-4 md:mt-0">
              Thời gian ứng tuyển đã hết hạn
            </span>
          ) : (
            <Button
              onClick={isApplied ? null : handlerApplyJob}
              disabled={isApplied}
              className={`rounded-lg p-2 ${
                isApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f32ad]"
              }`}
            >
              {isApplied ? "Đã ứng tuyển" : "Ứng tuyển"}
            </Button>
          )}
        </div>
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
          Chi tiết công việc
        </h1>
        <div className="my-4">
          <h1 className="font-bold my-1">
            Vai trò:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.title}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Vị trí:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.location}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Mô tả:{" "}
            <span className="pl-4 font-normal text-gray-800 whitespace-pre-line">
              {singleJob?.description}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Yêu cầu:{" "}
            <span className="pl-4 font-normal text-gray-800 whitespace-pre-line">
              {singleJob?.requirements}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Kinh nghiệm từ:{" "}
            <span className="pl-4 font-semibold text-gray-800">
              {singleJob?.experienceLevel} năm trở lên
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Lương:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {formatNumber(singleJob?.salary)} VND
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Tổng số người nộp đơn:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.applications?.length}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Ngày đăng:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.postDate.split("T")[0]}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Ngày hết hạn ứng tuyển:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.expiryDate.split("T")[0]}
            </span>
          </h1>
        </div>
      </div>
    </>
  );
}