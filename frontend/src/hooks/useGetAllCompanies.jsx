import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { COMPANY_API } from "@/utils/constant.js";
import { setCompanies } from "@/redux/companySlice.js";

export default function useGetAllCompanies() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API}/get-company`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchCompanies();
  }, []);
}
