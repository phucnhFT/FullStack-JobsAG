import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_API } from "@/utils/constant";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

export default function PostJob() {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    salary: "",
    location: "",
    jobType: "",
    category: "",
    experience: "",
    position: 0,
    companyId: "",
    postDate: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    } else {
      toast.error("Không tìm thấy công ty được chọn.");
    }
  };

  const jobTypeChangeHandler = (value) => {
    setInput({ ...input, jobType: value });
  };

  const submitHanlder = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/employer/jobs");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5 px-4">
        <form
          onSubmit={submitHanlder}
          className="p-8 w-full max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tên công việc</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full"
              />
            </div>
            <div>
              <Label>Mô tả công việc</Label>
              <Textarea
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                rows={4}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full"
              />
            </div>
            <div>
              <Label>Yêu cầu</Label>
              <Textarea
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                rows={4}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full"
              />
            </div>
            <div>
              <Label>Quyền lợi</Label>
              <Textarea
                name="benefits"
                value={input.benefits}
                onChange={changeEventHandler}
                rows={4}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full"
              />
            </div>
            <div>
              <Label>Lương</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full"
              />
            </div>
            <div>
              <Label>Địa chỉ</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full"
              />
            </div>
            <div>
              <Label>Loại công việc</Label>
              <Select onValueChange={jobTypeChangeHandler}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại công việc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Toàn Thời Gian">
                      Toàn thời gian
                    </SelectItem>
                    <SelectItem value="Bán Thời Gian">Bán thời gian</SelectItem>
                    <SelectItem value="Công việc tự do">
                      Công việc tự do
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Danh mục</Label>
              <Input
                type="text"
                name="category"
                value={input.category}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full"
              />
            </div>
            <div>
              <Label>Kinh nghiệm</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 w-full"
              />
            </div>
            <div>
              <Label>Số lượng vị trí</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 w-full my-1"
              />
            </div>
            <div>
              <Label>Ngày đăng tuyển</Label>
              <Input
                type="date"
                name="postDate"
                value={input.postDate}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 w-full my-1"
              />
            </div>
            <div>
              <Label>Ngày hết hạn</Label>
              <Input
                type="date"
                name="expiryDate"
                value={input.expiryDate}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 w-full"
              />
            </div>
            {companies && companies.length > 0 && (
              <div className="flex-1">
                <Label>Chọn công ty</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn công ty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vui lòng chờ
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Đăng tuyển công việc
            </Button>
          )}
          {companies && companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Vui lòng đăng ký công ty trước khi đăng tuyển dụng
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
