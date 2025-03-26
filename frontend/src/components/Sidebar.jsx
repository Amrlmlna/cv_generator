"use client";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaPlus,
  FaFileAlt,
  FaBriefcase,
  FaUser,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check for dark mode preference
  useEffect(() => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // Toggle dark mode
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  // Define navigation items based on user role
  const menuItems = [
    {
      to: "/dashboard",
      icon: <FaHome className="w-5 h-5" />,
      label: "Dashboard",
      roles: ["user", "hr"],
    },
    {
      to: "/create-cv",
      icon: <FaPlus className="w-5 h-5" />,
      label: "Create CV",
      roles: ["user"],
    },
    {
      to: "/my-cvs",
      icon: <FaFileAlt className="w-5 h-5" />,
      label: "My CVs",
      roles: ["user"],
    },
    {
      to: "/get-hired",
      icon: <FaBriefcase className="w-5 h-5" />,
      label: user?.role === "hr" ? "Find Talent" : "Get Hired",
      roles: ["user", "hr"],
    },
    {
      to: "/profile",
      icon: <FaUser className="w-5 h-5" />,
      label: "Profile",
      roles: ["user", "hr"],
    },
  ];

  // Filter menu items based on user role and search term
  const filteredMenuItems = menuItems
    .filter((item) => item.roles.includes(user?.role))
    .filter(
      (item) =>
        !searchTerm ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <aside
      className={`fixed h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header with logo */}
      <div className="relative p-4 border-b border-blue-800/30">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="font-bold text-white">CV</span>
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                CV Generator
              </h2>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-blue-800/30 hover:bg-blue-700/50 transition-colors"
          >
            {collapsed ? (
              <FaChevronRight size={14} />
            ) : (
              <FaChevronLeft size={14} />
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div
        className={`p-4 border-b border-blue-800/30 ${
          collapsed ? "text-center" : ""
        }`}
      >
        <div className="flex flex-col items-center mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white mb-2 p-1 ring-2 ring-blue-300/30">
            <div className="w-full h-full rounded-full bg-blue-900 flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          {!collapsed && (
            <div className="text-center">
              <h3 className="font-medium text-white">{user?.name || "User"}</h3>
              <p className="text-xs text-blue-200 capitalize">
                {user?.role || "Role"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar - Only show when not collapsed */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-blue-900/30 border border-blue-800/30 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300/70" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="px-3 py-2 overflow-y-auto h-[calc(100vh-240px)]">
        {!collapsed && (
          <h3 className="text-xs font-semibold uppercase text-blue-300/70 px-3 mb-2">
            Menu
          </h3>
        )}
        <nav className={`${collapsed ? "space-y-4 mt-4" : "space-y-1"}`}>
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center ${
                  collapsed ? "justify-center" : "justify-start"
                } gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-lg shadow-blue-900/30"
                    : "text-blue-200 hover:bg-blue-800/30 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-blue-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap z-20 shadow-lg">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800/30 w-full">
        {collapsed ? (
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={toggleTheme}
              className="p-2 text-blue-200 hover:text-white transition-colors"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button
              onClick={logout}
              className="p-2 text-blue-200 hover:text-white transition-colors"
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-3 py-2 text-blue-200 hover:text-white transition-colors rounded-lg hover:bg-blue-800/30"
            >
              {darkMode ? (
                <>
                  <FaSun className="mr-3" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon className="mr-3" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-blue-200 hover:text-white transition-colors rounded-lg hover:bg-blue-800/30"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
