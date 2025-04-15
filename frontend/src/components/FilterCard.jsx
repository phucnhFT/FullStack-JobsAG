import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/JobSlice";
import { Input } from "./ui/input";
import { provinces } from "@/utils/data"; // Đảm bảo file có mảng tỉnh/thành

const salaryOptions = [
  "Dưới 5 triệu",
  "5 - 10 triệu",
  "10 - 20 triệu",
  "Trên 20 triệu",
];

export default function FilterCard() {
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    salary: "",
  });
  const [provinceSearch, setProvinceSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch(); // Gửi các filter + text search lên redux
  useEffect(() => {
    dispatch(
      setSearchedQuery({
        ...selectedFilters,
        searchJobByText: searchText,
      })
    );
  }, [selectedFilters, searchText]);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({ ...prev, [type]: value }));
  };
  const filteredProvinces = provinces.filter((prov) =>
    prov.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-white p-4 rounded-md shadow">
      <h1 className="font-bold text-lg mb-4">Bộ lọc công việc</h1>
      {/* Ô tìm kiếm chung */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Tìm kiếm công việc</h2>
        <Input
          placeholder="Tìm theo tên công việc, địa điểm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {/* Filter Địa điểm */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Địa điểm</h2>
        <select
          className="w-full border rounded px-3 py-2"
          value={selectedFilters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        >
          <option value="">-- Chọn tỉnh/thành phố --</option>
          {filteredProvinces.map((prov, idx) => (
            <option key={idx} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>
      {/* Filter Lương */}
      <div>
        <h2 className="font-semibold mb-2">Mức lương</h2>
        {salaryOptions.map((salary, idx) => {
          const id = `salary-${idx}`;
          return (
            <div className="flex items-center space-x-2 my-1" key={id}>
              <input
                type="radio"
                id={id}
                name="salary"
                value={salary}
                checked={selectedFilters.salary === salary}
                onChange={(e) => handleFilterChange("salary", e.target.value)}
              />
              <label htmlFor={id}>{salary}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
