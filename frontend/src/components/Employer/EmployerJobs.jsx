import EmployerJobsTable from "@/components/Employer/EmployerJobsTable";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/JobSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function EmployerJobs() {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between my-5 space-y-4 sm:space-y-0">
          <Input
            className="w-full sm:w-fit"
            placeholder="Lọc theo tên, vai trò"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className="w-full sm:w-auto mt-4 sm:mt-0"
            onClick={() => navigate("/employer/jobs/create")}
          >
            Đăng tuyển
          </Button>
        </div>
        <EmployerJobsTable />
      </div>
    </div>
  );
}
