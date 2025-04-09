"use client";

import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Briefcase,
  User,
  Compass,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // Import the auth context

const JobSeekerSidebar = ({ open, setOpen }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate(); // For navigation after logout
  const { logout } = useAuth(); // Get the logout function from auth context

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        open
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  // Close sidebar when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setOpen]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page after logout
  };

  const navItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "CV Builder", icon: FileText, path: "/cv-builder" },
    { title: "Saved CVs", icon: FileText, path: "/saved-cvs" },
    { title: "Career Path", icon: Compass, path: "/career-path" },
    { title: "Get Hired", icon: Briefcase, path: "/get-hired" },
    { title: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:sticky top-0 left-0 h-screen bg-white shadow-lg z-30 transition-all duration-300 ease-in-out ${
          open ? "w-64" : "w-0 md:w-16"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2
              className={`font-bold text-primary-600 text-xl ${
                !open && "md:hidden"
              }`}
            >
              CareerHub
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-secondary-100 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-2.5 text-secondary-700 hover:bg-secondary-100 hover:text-primary-600"
                    onClick={() => window.innerWidth < 768 && setOpen(false)}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    <span className={`ml-3 ${!open && "md:hidden"}`}>
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-secondary-700 hover:bg-secondary-100 hover:text-primary-600"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className={`ml-3 ${!open && "md:hidden"}`}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobSeekerSidebar;
