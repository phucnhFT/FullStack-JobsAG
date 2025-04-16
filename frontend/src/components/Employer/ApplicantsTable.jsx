import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APPLICANTS_API } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

// Trạng thái ứng viên có thể chọn
const shortlistingStatus = ["đã chấp nhận", "đã từ chối"];

export default function ApplicantsTable() {
  const { applicants } = useSelector((store) => store.application);
  const [updatedStatuses, setUpdatedStatuses] = useState({}); // Lưu trạng thái đã xử lý

  // Cập nhật trạng thái ứng viên
  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICANTS_API}/status/${id}/update`, {
        status,
      });
      if (res.data.success) {
        toast.success("Trạng thái đã được cập nhật");
        toast.success(res.data.message);

        // Cập nhật trạng thái trong state
        setUpdatedStatuses((prev) => ({
          ...prev,
          [id]: status,
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật trạng thái");
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
      <Table>
        <TableCaption className="text-gray-500 mb-4">
          Danh sách người dùng đã ứng tuyển gần đây
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100 text-sm text-gray-600">
            <TableHead>Họ & Tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>CV</TableHead>
            <TableHead>Ngày</TableHead>
            <TableHead className="text-right">Trạng thái & Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.map((item) => {
            // Lấy trạng thái từ backend hoặc mặc định là "đang chờ"
            const statusFromBackend = item.status || "đang chờ";
            const currentStatus =
              updatedStatuses[item._id] || statusFromBackend;
            const isHandled = shortlistingStatus.includes(currentStatus);

            return (
              <TableRow
                key={item._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <TableCell className="font-medium">
                  {item?.applicant?.fullname}
                </TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell>
                  {item.applicant?.profile?.resume ? (
                    <a
                      className="text-blue-600 hover:underline flex items-center gap-1"
                      href={item?.applicant?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📄 {item?.applicant?.profile?.resumeOriginalName}
                    </a>
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                </TableCell>
                <TableCell>
                  {item?.applicant?.createdAt?.split("T")[0] || "Không rõ"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    {/* Hiển thị trạng thái */}
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-200 ${
                        currentStatus === "đã chấp nhận"
                          ? "bg-green-100 text-green-700"
                          : currentStatus === "đã từ chối"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {currentStatus}
                    </span>

                    {/* Hiển thị hành động nếu chưa xử lý */}
                    {!isHandled && (
                      <Popover>
                        <PopoverTrigger>
                          <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-700" />
                        </PopoverTrigger>
                        <PopoverContent className="w-44 rounded-lg shadow-lg border border-gray-200">
                          <div className="flex flex-col">
                            {shortlistingStatus.map((status, index) => (
                              <button
                                key={index}
                                onClick={() => statusHandler(status, item._id)}
                                className="text-sm text-gray-700 text-left px-3 py-2 hover:bg-gray-100 hover:text-blue-600 transition-all"
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
