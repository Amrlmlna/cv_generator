"use client";

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";

const MainLayout = ({ isJobSeeker, isRecruiter }) => {
  // Update the useState line to have the sidebar collapsed by default
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update the main layout structure to ensure proper spacing and prevent overlap
  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isJobSeeker={isJobSeeker}
        isRecruiter={isRecruiter}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuButtonClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
