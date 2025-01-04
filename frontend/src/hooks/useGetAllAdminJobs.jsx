import { useEffect } from "react";
import { setAllAdminJobs } from "@/redux/JobSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";
import { JOB_API } from "@/utils/constant.js";

export default function useGetAllAdminJobs() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API}/get-admin-jobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchAllAdminJobs();
  }, []);
}
