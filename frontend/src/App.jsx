import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import Home from "@/components/home";
import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import InterestedCompanies from "@/components/auth/InterestedCompanies";
import Jobs from "@/components/jobs";
import Browse from "@/components/Browse";
import Profile from "@/components/Profile.jsx";
import Admin from "@/components/Admin/Admin";
import AdminUsers from "@/components/Admin/UserAdmin";
import JobAdmin from "@/components/Admin/JobAdmin";
import JobDescription from "@/components/JobDescription";
import ProtectedRoute from "@/components/Employer/ProtectedRoute";
import Companies from "@/components/Employer/Companies";
import CompanyCreate from "@/components/Employer/CompanyCreate";
import CompanySetup from "@/components/Employer/CompanySetup";
import EmployerJobs from "@/components/Employer/EmployerJobs";
import PostJob from "@/components/Employer/PostJob";
import Applicants from "@/components/Employer/Applicants";

const appRouter = createBrowserRouter([
  // Ứng Viên
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/interested-companies/",
    element: <InterestedCompanies />,
  },
  {
    path: "/delete-interested/:companyId",
    element: <InterestedCompanies />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },

  //ADMIN
  {
    path: "/admin",
    element: <Admin />,
  },

  {
    path: "/admin/users",
    element: <AdminUsers />,
  },
  {
    path: "/admin/jobs",
    element: <JobAdmin />,
  },

  //Nhà Tuyển dụng
  {
    path: "/employer/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employer/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employer/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employer/jobs",
    element: (
      <ProtectedRoute>
        <EmployerJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employer/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employer/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  );
}

export default App;
