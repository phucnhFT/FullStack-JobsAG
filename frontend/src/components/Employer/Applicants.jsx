import ApplicantsTable from '@/components/Employer/ApplicantsTable';
import Navbar from '@/components/shared/Navbar'
import { setAllApplicants } from '@/redux/applicationSlice';
import { APPLICANTS_API } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function Applicants() {
  const params = useParams()
  const dispatch = useDispatch()
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICANTS_API}/${params.id}/applicants`,
          { withCredentials: true }
        );
        dispatch(setAllApplicants(res.data.job));

      } catch(e) {
        console.log(e)
      }
    }
    fetchApplicants()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-xl my-5">
          Ứng viên {applicants?.applications?.length}
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  );
}
