import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setInterestedCompanies,
  removeInterestedCompany,
} from "@/redux/userSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function InterestedCompanies() {
  const { loading, interestedCompanies } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (companyId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const fetchCompanies = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${USER_API}/get-interested`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setInterestedCompanies(res.data.companies));
      } else {
        toast.error("Không thể lấy danh sách công ty.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRemoveCompany = async (companyId) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.delete(
        `${USER_API}/delete-interested/${companyId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(removeInterestedCompany(companyId));
        toast.success("Xóa công ty khỏi danh sách thành công.");
      } else {
        toast.error("Không thể xóa công ty.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi không xác định.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto border border-gray-300 rounded-lg shadow-lg bg-white p-6 mt-4">
        <div className="flex flex-col items-center mx-auto max-w-7xl">
          <h1 className="font-medium text-xl mt-8">
            Danh sách công ty quan tâm
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="w-full my-10">
              {interestedCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interestedCompanies.map((company) => (
                    <div
                      key={company._id}
                      className="border border-gray-200 p-4 rounded-md"
                    >
                      <Avatar>
                        <AvatarImage src={company.logo} />
                      </Avatar>
                      <h2 className="font-medium text-lg mt-2">
                        {company.name}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {expandedItems[company._id]
                          ? company.description
                          : `${company.description?.slice(0, 100)}...`}
                      </p>
                      {company.description?.length > 100 && (
                        <button
                          onClick={() => toggleExpand(company._id)}
                          className="text-blue-600 text-sm mt-1"
                        >
                          {expandedItems[company._id] ? "Thu gọn" : "Xem thêm"}
                        </button>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveCompany(company._id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 mt-10">
                  Bạn chưa theo dõi công ty nào.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
