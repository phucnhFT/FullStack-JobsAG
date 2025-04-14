import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API } from "@/utils/constant";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CompanyCreate() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    if (!companyName.trim() || !employeeCount.trim()) {
      setError("Tên công ty và số lượng nhân viên không được để trống");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${COMPANY_API}/create`,
        { companyName, employeeCount: parseInt(employeeCount) },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/employer/companies/${companyId}`);
      }
    } catch (e) {
      console.log(e);
      setError("Có lỗi xảy ra khi tạo công ty. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="my-10">
          <h1 className="font-bold text-2xl sm:text-3xl">
            Thông tin công ty của bạn
          </h1>
          <p className="text-gray-500 mt-2">
            Bạn muốn đặt tên công ty là gì? Bạn có thể thay đổi sau.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Tên Công Ty</Label>
          <Input
            id="companyName"
            type="text"
            className="w-full"
            placeholder="JobAG, ABC etc..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Label htmlFor="employeeCount">Số lượng nhân viên</Label>
          <Input
            id="employeeCount"
            type="number"
            className="w-full"
            placeholder="Số lượng nhân viên"
            value={employeeCount}
            onChange={(e) => setEmployeeCount(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex items-center gap-2 my-10">
          <Button
            variant="outline"
            onClick={() => navigate("/employer/companies")}
            disabled={isLoading}
          >
            Huỷ bỏ
          </Button>
          <Button onClick={registerNewCompany} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Tiếp tục"}
          </Button>
        </div>
      </div>
    </div>
  );
}
