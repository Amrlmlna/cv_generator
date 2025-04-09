"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Bell, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = ({ onMenuButtonClick }) => {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <button
            onClick={onMenuButtonClick}
            className="p-2 rounded-md text-secondary-500 hover:bg-secondary-100 md:mr-2"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block">
            <Link to="/" className="text-xl font-bold text-primary-600">
              CareerHub
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-secondary-500 hover:bg-secondary-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-600"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden md:inline text-sm font-medium text-secondary-700">
                {currentUser?.name || "User"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-secondary-200">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>Profile</span>
                  </div>
                </Link>

                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <Settings size={16} />
                    <span>Settings</span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
