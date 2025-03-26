"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import DashboardStats from "../components/DashboardStats"
import { FaPlus, FaFileAlt, FaBriefcase } from "react-icons/fa"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === "user"
            ? "Create and manage your professional CVs with AI assistance."
            : "Browse and find talented candidates for your organization."}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {user?.role === "user" && (
          <Link
            to="/create-cv"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <FaPlus className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Create New CV</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Build a professional CV with AI assistance</p>
            </div>
          </Link>
        )}

        {user?.role === "user" && (
          <Link
            to="/my-cvs"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400">
              <FaFileAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">My CVs</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your created CVs</p>
            </div>
          </Link>
        )}

        <Link
          to="/get-hired"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <FaBriefcase className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Get Hired</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.role === "user" ? "Make your CV visible to recruiters" : "Browse and find talented candidates"}
            </p>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <DashboardStats />
    </div>
  )
}

export default Dashboard

