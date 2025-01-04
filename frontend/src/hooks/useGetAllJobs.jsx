import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { JOB_API } from "@/utils/constant.js";
import { setAllJobs } from "@/redux/JobSlice.js";

export default function useGetAllJobs() {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job); // tìm kiếm bằng từ khoá
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API}/get-all-job?keyword=${searchedQuery}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchAllJobs();
  }, []);
}
