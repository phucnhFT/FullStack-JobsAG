import CategoryCarousel from '@/components/CategoryCarousel'
import HeroSection from '@/components/HeroSection'
import LatestJobs from '@/components/LatestJobs'
import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === "Nhà Tuyển Dụng") {
      navigate("/employer/companies");
    }
  }, []);
  useEffect(() => {
    if (user?.role === "Admin") {
      navigate("/admin");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  )
}