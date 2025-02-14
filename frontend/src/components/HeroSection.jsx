import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/JobSlice.js";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandlerSearchJob = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      HandlerSearchJob();
    }
  };
  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10 px-4">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
          No. 1 JobsAG Website
        </span>
        <h1 className="text-3xl md:text-5xl">
          Tìm kiếm, ứng tuyển & <br /> nhận việc{" "}
          <span className="text-[#2a21a8] font-bold">mơ ước của bạn</span>
        </h1>
        <p className="text-sm md:text-base">
          Tìm kiếm và nộp đơn cho công việc phù hợp nhất với bạn
        </p>
        <div className="flex w-full md:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="tìm kiếm công việc"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="outline-none border-none w-full"
          />
          <Button
            onClick={HandlerSearchJob}
            className="rounded-r-full bg-[#6A38C2]"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
