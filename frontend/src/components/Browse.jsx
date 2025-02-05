import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs, setSearchedQuery } from "@/redux/JobSlice.js";
import Job from "@/components/Job.jsx";
import axios from "axios";
import { JOB_API } from "@/utils/constant"; 
import useGetAllJobs from "@/hooks/useGetAllJobs";
import Navbar from "@/components/shared/Navbar";

export default function Browse() {
  useGetAllJobs();
  const dispatch = useDispatch();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchJobsByCategory = async () => {
      try {
        const response = await axios.get(`${JOB_API}/jobs-by-category`, {
          params: { category: searchedQuery }, //truyền id danh mục vào tham số truy vấn
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setAllJobs(response.data.jobs));
          dispatch(setSearchedQuery("")); //cập nhật store trong redux
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm công việc theo danh mục:", error);
      }
    };

    fetchJobsByCategory();
  }, [searchedQuery, dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="font-bold text-lg md:text-xl my-10">
          Kết quả tìm kiếm ({allJobs.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
