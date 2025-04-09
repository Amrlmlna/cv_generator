"use client";

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/shared/Navbar";
import JobSeekerSidebar from "../components/JobSeekerSidebar";
import RecruiterSidebar from "../components/RecruiterSidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  // Determine user type - you'll need to adjust this based on how you store user roles
  const isJobSeeker = currentUser && currentUser.role === "jobSeeker";
  const isRecruiter = currentUser && currentUser.role === "recruiter";

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Render the appropriate sidebar based on user role */}
      {isJobSeeker && (
        <JobSeekerSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}
      {isRecruiter && (
        <RecruiterSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
