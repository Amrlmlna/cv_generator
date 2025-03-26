"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"
import { FaSpinner } from "react-icons/fa"
import CVFilter from "../components/CVFilter"
import PublicCVCard from "../components/PublicCVCard"

const GetHired = () => {
  const { user } = useAuth()
  const [cvs, setCVs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "",
    search: "",
  })

  // Fetch public CVs on component mount
  useEffect(() => {
    fetchPublicCVs()
  }, [])

  // Fetch public CVs from API
  const fetchPublicCVs = async () => {
    try {
      setIsLoading(true)

      // Different endpoints for different user roles
      const endpoint = user?.role === "hr" ? "/api/cvs/public/all" : "/api/cvs"

      // Add query parameters if filters are set
      const queryParams = new URLSearchParams()
      if (filters.category) queryParams.append("category", filters.category)
      if (filters.search) queryParams.append("search", filters.search)

      const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

      const response = await axios.get(url)

      if (response.data.success) {
        setCVs(response.data.cvs)
      }
    } catch (error) {
      console.error("Error fetching CVs:", error)
      toast.error("Failed to load CVs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)

    // Fetch CVs with new filters
    fetchPublicCVs()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{user?.role === "hr" ? "Find Talent" : "Get Hired"}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === "hr"
            ? "Browse through CVs and find the perfect candidate for your organization."
            : "Make your CV public to be discovered by recruiters and companies."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <CVFilter onFilter={handleFilterChange} />
        </div>

        {/* CV List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin h-8 w-8 text-primary-500" />
            </div>
          ) : cvs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {user?.role === "hr"
                  ? "No CVs found matching your criteria. Try adjusting your filters."
                  : "You have no public CVs. Make your CVs public to be discovered by recruiters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cvs.map((cv) => (
                <PublicCVCard key={cv.id} cv={cv} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GetHired

