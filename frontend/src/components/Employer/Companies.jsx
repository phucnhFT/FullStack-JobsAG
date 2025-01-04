import CompaniesTable from "@/components/Employer/CompaniesTable";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "@/redux/companySlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Companies() {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between my-5 gap-4">
          <Input
            className="w-full md:w-fit"
            placeholder="Lọc theo tên"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className="w-full md:w-fit"
            onClick={() => navigate("/employer/companies/create")}
          >
            Công ty mới
          </Button>
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
}
