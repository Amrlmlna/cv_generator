"use client"

import { useState, useEffect } from "react"
import { FaFileAlt, FaEye, FaDownload, FaBriefcase } from "react-icons/fa"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const DashboardStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCVs: 0,
    publicCVs: 0,
    downloads: 0,
    views: 0,
    recentCVs: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you would have an endpoint for stats
        // For now, we'll simulate it by fetching CVs
        const response = await axios.get("/api/cvs")

        if (response.data.success) {
          const cvs = response.data.cvs

          setStats({
            totalCVs: cvs.length,
            publicCVs: cvs.filter((cv) => cv.is_public).length,
            downloads: Math.floor(Math.random() * 50), // Simulated data
            views: Math.floor(Math.random() * 100), // Simulated data
            recentCVs: cvs.slice(0, 3), // Get 3 most recent CVs
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.role === "user") {
      fetchStats()
    } else {
      // For HR users, fetch different stats
      setIsLoading(false)
      setStats({
        totalCVs: Math.floor(Math.random() * 100) + 50, // Simulated data
        publicCVs: Math.floor(Math.random() * 50) + 20, // Simulated data
        downloads: Math.floor(Math.random() * 30), // Simulated data
        views: Math.floor(Math.random() * 80), // Simulated data
        recentCVs: [],
      })
    }
  }, [user])

  // Chart data
  const chartData = {
    labels: ["Total CVs", "Public CVs", "Downloads", "Views"],
    datasets: [
      {
        label: "CV Statistics",
        data: [stats.totalCVs, stats.publicCVs, stats.downloads, stats.views],
        backgroundColor: [
          "rgba(14, 165, 233, 0.7)", // primary-500
          "rgba(139, 92, 246, 0.7)", // secondary-500
          "rgba(34, 197, 94, 0.7)", // green-500
          "rgba(249, 115, 22, 0.7)", // orange-500
        ],
        borderColor: [
          "rgb(14, 165, 233)", // primary-500
          "rgb(139, 92, 246)", // secondary-500
          "rgb(34, 197, 94)", // green-500
          "rgb(249, 115, 22)", // orange-500
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "CV Statistics",
        color: document.documentElement.classList.contains("dark") ? "#f3f4f6" : "#1f2937",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains("dark") ? "#d1d5db" : "#4b5563",
        },
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains("dark") ? "#d1d5db" : "#4b5563",
        },
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <FaFileAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total CVs</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{stats.totalCVs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400">
              <FaBriefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Public CVs</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{stats.publicCVs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FaDownload className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Downloads</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{stats.downloads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <FaEye className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Views</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{stats.views}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default DashboardStats

