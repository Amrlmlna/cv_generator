"use client";

import { Menu, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = ({ onMenuButtonClick }) => {
  const { currentUser } = useAuth();

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

          <Link to="/profile" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="hidden md:inline text-sm font-medium text-secondary-700">
              {currentUser?.name || "User"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
