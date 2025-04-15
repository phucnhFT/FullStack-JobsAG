import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

// const formatCurrency = (value) => {
//   return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
// };

export default function Jobs() {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  const salaryRanges = {
    "Dưới 5 triệu": [0, 5000000],
    "5 - 10 triệu": [5000000, 10000000],
    "10 - 20 triệu": [10000000, 20000000],
    "Trên 20 triệu": [20000000, Infinity],
  };

  useEffect(() => {
    if (allJobs.length > 0) {
      let filteredJobs = allJobs;

      // Lọc theo location nếu có
      if (searchedQuery.location) {
        filteredJobs = filteredJobs.filter((job) =>
          job.location
            .toLowerCase()
            .includes(searchedQuery.location.toLowerCase())
        );
      }

      // Lọc theo salary nếu có
      if (searchedQuery.salary) {
        const [minSalary, maxSalary] = salaryRanges[searchedQuery.salary] || [
          0,
          Infinity,
        ];
        filteredJobs = filteredJobs.filter((job) => {
          const salary = job.salary; // job.salary là số
          return salary >= minSalary && salary <= maxSalary;
        });
      }

      // Lọc theo text (title, description, location, category)
      if (searchedQuery.searchJobByText) {
        const searchText = searchedQuery.searchJobByText.toLowerCase();

        filteredJobs = filteredJobs.filter(
          (job) =>
            job.title.toLowerCase().includes(searchText) ||
            job.description.toLowerCase().includes(searchText) ||
            job.location.toLowerCase().includes(searchText) ||
            (job.category && job.category.toLowerCase().includes(searchText))
        );
      }

      setFilterJobs(filteredJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/4">
            <FilterCard />
          </div>
          {filterJobs.length <= 0 ? (
            <span>Không có công việc...</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <Job job={job} />

                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
