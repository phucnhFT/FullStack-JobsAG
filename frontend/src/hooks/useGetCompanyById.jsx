import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { COMPANY_API } from "@/utils/constant.js";
import { setSingleCompany } from "@/redux/companySlice.js";

export default function useGetCompanyById(companyId) {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API}/get-company/${companyId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchSingleCompany();
  }, [companyId, dispatch]); //api chỉ được gọi khi companyId thay đổi
}
