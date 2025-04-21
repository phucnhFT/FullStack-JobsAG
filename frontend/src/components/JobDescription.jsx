import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/JobSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { APPLICANTS_API, JOB_API } from "@/utils/constant";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function JobDescription({ job }) {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.user);
  const [isExpired, setIsExpired] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      toast.error(e?.response?.data?.message || "Có lỗi xảy ra");
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
          const currentDate = new Date();
          const expiryDate = new Date(res.data.job.expiryDate);
          setIsExpired(expiryDate < currentDate);

          const isInitiallyApplied = res.data.job.applications.some(
            (application) => application.applicant === user?._id
          );
          setIsApplied(isInitiallyApplied);
        } else {
          toast.error("Lỗi khi lấy thông tin công việc");
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const formatNumber = (num) => {
    if (typeof num !== "number") return "Không có dữ liệu";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-4 border-b pb-6">
              <div>
                <h1 className="text-3xl font-bold">{singleJob?.title}</h1>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge
                    className={"text-blue-700 font-bold text-xs md:text-sm"}
                    variant="outline"
                  >
                    Số lượng: {singleJob?.position}
                  </Badge>
                  <Badge
                    className={"text-[#F83002] font-bold text-xs md:text-sm"}
                    variant="outline"
                  >
                    {singleJob?.jobType}
                  </Badge>
                  <Badge
                    className={"text-[#7209b7] font-bold text-xs md:text-sm"}
                    variant="outline"
                  >
                    {formatNumber(singleJob?.salary)} VND
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Mô tả công việc</h2>
                <p className="text-gray-800 whitespace-pre-line">
                  {singleJob?.description}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Yêu cầu</h2>
                <p className="text-gray-800 whitespace-pre-line">
                  {singleJob?.requirements}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Quyền lợi</h2>
                <p className="text-gray-800 whitespace-pre-line">
                  {singleJob?.benefits}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-md p-6 space-y-4 h-fit">
            <div>
              <p className="text-sm text-gray-500">Kinh nghiệm</p>
              <p className="font-medium">{singleJob?.experienceLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Địa điểm</p>
              <p className="font-medium">{singleJob?.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lương</p>
              <p className="font-medium">
                {formatNumber(singleJob?.salary)} VND
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày đăng</p>
              <p className="font-medium">
                {singleJob?.postDate?.split("T")[0]}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hạn ứng tuyển</p>
              <p className="font-medium">
                {singleJob?.expiryDate?.split("T")[0]}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số người ứng tuyển</p>
              <p className="font-medium">
                {singleJob?.applications?.length || 0}
              </p>
            </div>

            {/* THÔNG BÁO HẾT HẠN */}
            {isExpired && (
              <p className="text-red-600 font-medium text-sm">
                Công việc này đã hết hạn ứng tuyển.
              </p>
            )}

            {/* NÚT ỨNG TUYỂN */}
            {!isExpired && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={isApplied}
                    className={`rounded-lg px-6 py-2 ${
                      isApplied
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#7209b7] hover:bg-[#5f32ad]"
                    }`}
                  >
                    {isApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận ứng tuyển</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc chắn muốn ứng tuyển công việc này không? Sau
                      khi xác nhận, hệ thống sẽ gửi hồ sơ của bạn tới nhà tuyển
                      dụng.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => document.activeElement.blur()}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handlerApplyJob}>
                      Xác nhận ứng tuyển
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
