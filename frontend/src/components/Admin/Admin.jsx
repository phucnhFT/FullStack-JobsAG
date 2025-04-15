import JobStats from '@/components/Admin/JobStats';
import AdminUsers from '@/components/Admin/UserAdmin'
import Navbar from '@/components/shared/Navbar'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  // Kiểm tra xem người dùng có phải là quản trị viên không
  useEffect(() => {
    if (user?.role === "Admin") {
      navigate("/admin");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <JobStats />
    </div>
  );
}
