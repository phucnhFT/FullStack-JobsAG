import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/JobSlice";

const filterData = [
  {
    filterType: "Địa điểm",
    array: ["AN GIANG", "TP HCM", "HÀ NỘI"],
  },
  {
    filterType: "Công việc liên quan",
    array: [
      "Lập trình viên",
      "Nông nghiệp & Nông sản",
      "Quản lí nhân sự",
      "Nhân viên",
    ],
  },
  // {
  //   filterType: "Lương",
  //   array: ["12", "12 triệu - 20 triệu", "trên 20 triệu"],
  // },
];

export default function FilterCard(){
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();
  const changeHandler = (value) => {
    setSelectedValue(value);
  };
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Bộ lọc công việc</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div>
            <h1 className="font-bold text-lg">{data.filterType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
