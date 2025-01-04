import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { APPLICANTS_API } from "@/utils/constant.js";
import { setAllAppliedJobs } from "@/redux/JobSlice.js";

export default function useGetAppliedJobs() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICANTS_API}/get-applicants`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchAppliedJobs();
  }, []);
}
