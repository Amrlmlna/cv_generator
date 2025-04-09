"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { getUserCVs } from "../services/cvService"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { FileText, Compass, Briefcase, Users, ArrowRight, User } from "lucide-react"

const Dashboard = () => {
  const { currentUser, isJobSeeker, isRecruiter } = useAuth()
  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(true)

  // Dashboard stats
  const [stats, setStats] = useState({
    cvCompletion: 0,
    careerPathsGenerated: 0,
    jobsApplied: 0,
    jobsViewed: 0,
    // Recruiter stats
    jobsPosted: 0,
    applicantsReviewed: 0,
    candidatesShortlisted: 0,
  })

  useEffect(() => {
    if (isJobSeeker) {
      fetchUserCVs()
    } else {
      // For recruiters, we'll add job listing fetching later
      setLoading(false)
    }
  }, [isJobSeeker])

  const fetchUserCVs = async () => {
    try {
      const response = await getUserCVs()
      setCvs(response.data)

      // Calculate CV completion based on number of CVs
      const cvCompletion = response.data.length > 0 ? 100 : 0

      setStats((prev) => ({
        ...prev,
        cvCompletion,
        // Other stats would come from API in a real implementation
      }))
    } catch (error) {
      console.error("Error fetching CVs:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts (would be replaced with real data in future)
  const activityData = [
    { name: "Mon", value: 4 },
    { name: "Tue", value: 6 },
    { name: "Wed", value: 8 },
    { name: "Thu", value: 5 },
    { name: "Fri", value: 12 },
    { name: "Sat", value: 3 },
    { name: "Sun", value: 2 },
  ]

  const pieData = isJobSeeker
    ? [
        { name: "CV Created", value: stats.cvCompletion },
        { name: "Remaining", value: 100 - stats.cvCompletion },
      ]
    : [
        { name: "Jobs Posted", value: 5 },
        { name: "Filled", value: 2 },
        { name: "Open", value: 3 },
      ]

  const COLORS = ["#0ea5e9", "#e2e8f0"]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">Welcome back, {currentUser?.name}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isJobSeeker && (
          <>
            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">CV Completion</p>
                  <p className="text-2xl font-semibold text-secondary-900">{stats.cvCompletion}%</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <FileText className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/cv-builder" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <span>Continue building</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Saved CVs</p>
                  <p className="text-2xl font-semibold text-secondary-900">{cvs.length}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <FileText className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/saved-cvs" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <span>View saved CVs</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Career Paths</p>
                  <p className="text-2xl font-semibold text-secondary-900">{stats.careerPathsGenerated}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Compass className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/career-path" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <span>Generate path</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Profile Completion</p>
                  <p className="text-2xl font-semibold text-secondary-900">80%</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <User className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/profile" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <span>Update profile</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </>
        )}

        {isRecruiter && (
          <>
            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Jobs Posted</p>
                  <p className="text-2xl font-semibold text-secondary-900">5</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Briefcase className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/job-listings" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <span>View jobs</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Total Applicants</p>
                  <p className="text-2xl font-semibold text-secondary-900">12</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Users className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/candidates" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <span>View applicants</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Shortlisted</p>
                  <p className="text-2xl font-semibold text-secondary-900">5</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Users className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/candidates" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <span>View shortlisted</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Profile Completion</p>
                  <p className="text-2xl font-semibold text-secondary-900">90%</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <User className="text-primary-600" size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/profile" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <span>Update profile</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            {isJobSeeker ? "Weekly Activity" : "Job Applications"}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            {isJobSeeker ? "CV Completion" : "Job Status"}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isJobSeeker && (
            <>
              <Link
                to="/cv-builder"
                className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 hover:bg-secondary-100 transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <FileText className="text-primary-600 mb-2" size={24} />
                  <p className="font-medium text-secondary-900">Build CV</p>
                  <p className="text-xs text-secondary-600 mt-1">Create or update your CV</p>
                </div>
              </Link>

              <Link
                to="/saved-cvs"
                className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 hover:bg-secondary-100 transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <FileText className="text-primary-600 mb-2" size={24} />
                  <p className="font-medium text-secondary-900">Saved CVs</p>
                  <p className="text-xs text-secondary-600 mt-1">View your saved CVs</p>
                </div>
              </Link>

              <Link
                to="/career-path"
                className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 hover:bg-secondary-100 transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <Compass className="text-primary-600 mb-2" size={24} />
                  <p className="font-medium text-secondary-900">Career Path</p>
                  <p className="text-xs text-secondary-600 mt-1">Get AI career guidance</p>
                </div>
              </Link>
            </>
          )}

          {isRecruiter && (
            <>
              <Link
                to="/job-listings"
                className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 hover:bg-secondary-100 transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <Briefcase className="text-primary-600 mb-2" size={24} />
                  <p className="font-medium text-secondary-900">Post Job</p>
                  <p className="text-xs text-secondary-600 mt-1">Create a new job listing</p>
                </div>
              </Link>

              <Link
                to="/candidates"
                className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 hover:bg-secondary-100 transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <Users className="text-primary-600 mb-2" size={24} />
                  <p className="font-medium text-secondary-900">View Candidates</p>
                  <p className="text-xs text-secondary-600 mt-1">Browse applicants</p>
                </div>
              </Link>
            </>
          )}

          <Link
            to="/profile"
            className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 hover:bg-secondary-100 transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <User className="text-primary-600 mb-2" size={24} />
              <p className="font-medium text-secondary-900">Profile</p>
              <p className="text-xs text-secondary-600 mt-1">Update your information</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

