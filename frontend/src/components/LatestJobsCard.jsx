import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LatestJobsCard({ job }) {
  const navigate = useNavigate();
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-4 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer"
    >
      <div>
        <Button className="p-4" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <h1 className="font-medium text-base md:text-lg">
          {job?.company?.name}
        </h1>
        <p className="text-xs md:text-sm text-gray-500">{job?.location}</p>
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
          Số lượng: {job?.position}
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
          {formatNumber(job.salary)}VND
        </Badge>
      </div>
    </div>
  );
}
