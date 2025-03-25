import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Để gọi API
import { USER_API } from "@/utils/constant";
import { toast } from "sonner";

export default function Job({ job }) {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleAddToFavorites = async () => {
    try {
      const res = await axios.post(
        `${USER_API}/interested-company`,
        {
          jobId: job?._id,
          companyId: job?.company?._id,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Đã Thêm công ty vào danh sách quan tâm");
      }
    } catch (error) {
      //console.error("Error adding to favorites:", error);
      toast.error("Lỗi hoặc công ty đã bị xoá !!");
    }
  };
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="p-4 rounded-md shadow-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-xs md:text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Hôm nay"
            : `${daysAgoFunction(job?.createdAt)} ngày trước`}
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          onClick={handleAddToFavorites}
        >
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button
          className="p-4"
          variant="outline"
          size="icon"
          onClick={() => navigate("/description/:id")}
        >
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-base md:text-lg">
            {job?.company?.name}
          </h1>
          <p className="text-xs md:text-sm text-gray-500">{job?.location}</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-base md:text-lg my-2">{job?.title}</h1>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
          {job?.description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge
          className={"text-blue-700 font-bold text-xs md:text-sm"}
          variant="ghost"
        >
          {job?.position} Positions
        </Badge>
        <Badge
          className={"text-[#F83002] font-bold text-xs md:text-sm"}
          variant="ghost"
        >
          {job?.jobType}
        </Badge>
        <Badge
          className={"text-[#7209b7] font-bold text-xs md:text-sm"}
          variant="ghost"
        >
          {formatNumber(job.salary)} VND
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="text-xs md:text-sm"
        >
          Chi tiết
        </Button>
        <Button className="bg-[#7209b7] text-xs md:text-sm">
          Lưu công việc
        </Button>
      </div>
    </div>
  );
}
