import LatestJobsCard from "@/components/LatestJobsCard";
import React from "react";
import { useSelector } from "react-redux";

export default function LatestJobs() {
  const { allJobs } = useSelector((store) => store.job);
  return (
    <div className="max-w-7xl mx-auto my-20 px-4">
      <h1 className="text-2xl md:text-4xl font-bold">
        <span className="text-[#2a21a8]">Mới nhất & Hàng đầu</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        {allJobs.length <= 0 ? (
          <span>Không có việc làm</span>
        ) : (
          allJobs
            ?.slice(0, 6)
            .map((job) => <LatestJobsCard key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
}
