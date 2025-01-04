import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentJobId, setCurrentJobId] = useState(null);

  const fetchJobs = async (page) => {
    try {
      const res = await axios.get(`${JOB_API}/get-all-jobs-admin`, {
        params: { page, limit },
        withCredentials: true,
      });
      if (res.data.success) {
        setJobs(res.data.jobs);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy danh sách công việc");
    }
  };

  const handleApproveJob = async (jobId) => {
    try {
      const res = await axios.put(
        `${JOB_API}/handle-job/${jobId}`,
        { action: "approve" },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Phê duyệt công việc thành công");
        fetchJobs(currentPage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi phê duyệt công việc");
    }
  };

  const openRejectModal = (jobId) => {
    setCurrentJobId(jobId);
    setIsOpen(true);
  };

  const handleRejectJob = async () => {
    if (!rejectReason) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }

    try {
      const res = await axios.put(
        `${JOB_API}/handle-job/${currentJobId}`,
        { action: "reject", reason: rejectReason },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Công việc đã bị từ chối và thông báo đã được gửi.");
        fetchJobs(currentPage);
        setIsOpen(false);
        setRejectReason("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi từ chối công việc.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa công việc này không?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${ JOB_API}/delete-job/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Công việc đã được xóa thành công");
        fetchJobs(currentPage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa công việc.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchJobs(page);
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Navbar />
      <h1 className="text-xl md:text-2xl font-bold mb-4 mt-6 md:mt-10">Danh sách Công việc</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal font-medium">
              <th className="py-3 px-4 md:py-3 md:px-6 text-left">Tiêu đề</th>
              <th className="py-3 px-4 md:py-3 md:px-6 text-left">Mô tả</th>
              <th className="py-3 px-4 md:py-3 md:px-6 text-left">Lương</th>
              <th className="py-3 px-4 md:py-3 md:px-6 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {jobs.map((job) => (
              <motion.tr
                key={job._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-4 md:py-3 md:px-6">{job.title}</td>
                <td className="py-3 px-4 md:py-3 md:px-6">{job.description}</td>
                <td className="py-3 px-4 md:py-3 md:px-6">{job.salary}</td>
                <td className="py-3 px-4 md:py-3 md:px-6 flex items-center">
                  {job.approved ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="mr-1" /> Đã phê duyệt
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <XCircle className="mr-1" /> Chưa phê duyệt
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 md:py-3 md:px-6 flex space-x-2">
                  {!job.approved && (
                    <Button
                      onClick={() => handleApproveJob(job._id)}
                      className="bg-green-500 text-white"
                    >
                      Phê duyệt
                    </Button>
                  )}
                  <Button
                    onClick={() => openRejectModal(job._id)}
                    className="bg-red-500 text-white"
                  >
                    Từ chối
                  </Button>
                  <Button
                    onClick={() => handleDeleteJob(job._id)}
                    className="bg-yellow-500 text-white"
                  >
                    Xóa
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập Lý Do Từ Chối</DialogTitle>
          </DialogHeader> 
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối công việc..."
          />
          <DialogFooter>
            <Button onClick={handleRejectJob} className="bg-red-500 text-white">
              Từ chối
            </Button>
            <DialogClose asChild>
              <Button className="bg-gray-300">Hủy</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}