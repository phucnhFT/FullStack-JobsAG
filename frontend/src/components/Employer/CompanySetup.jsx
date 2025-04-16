import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import { COMPANY_API } from "@/utils/constant";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
export default function CompanySetup() {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlerInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handlerFileChange = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API}/update-company/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/employer/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null,
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 p-6 sm:p-10 bg-white rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/employer/companies")}
            variant="outline"
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trở về</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            Thiết lập thông tin công ty
          </h1>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700">Tên công ty</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={handlerInputChange}
                className="mt-1"
                placeholder="Nhập tên công ty"
              />
            </div>

            <div>
              <Label className="text-gray-700">Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={handlerInputChange}
                className="mt-1"
                placeholder="https://example.com"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-gray-700">Mô tả</Label>
              <Textarea
                name="description"
                value={input.description}
                onChange={handlerInputChange}
                rows={4}
                className="mt-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                placeholder="Mô tả ngắn gọn về công ty..."
              />
            </div>

            <div>
              <Label className="text-gray-700">Vị trí</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={handlerInputChange}
                className="mt-1"
                placeholder="TP. Hồ Chí Minh, Hà Nội..."
              />
            </div>

            <div>
              <Label className="text-gray-700">Logo công ty</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handlerFileChange}
                className="mt-1"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-base font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật thông tin"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}