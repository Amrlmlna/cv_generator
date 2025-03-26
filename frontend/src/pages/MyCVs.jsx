"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { FaPlus, FaSpinner } from "react-icons/fa"
import CVCard from "../components/CVCard"

const MyCVs = () => {
  const [cvs, setCVs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch CVs on component mount
  useEffect(() => {
    fetchCVs()
  }, [])

  // Fetch CVs from API
  const fetchCVs = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/cvs")

      if (response.data.success) {
        setCVs(response.data.cvs)
      }
    } catch (error) {
      console.error("Error fetching CVs:", error)
      toast.error("Failed to load your CVs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete CV
  const handleDeleteCV = async (cvId) => {
    if (!confirm("Are you sure you want to delete this CV?")) {
      return
    }

    try {
      const response = await axios.delete(`/api/cvs/${cvId}`)

      if (response.data.success) {
        setCVs(cvs.filter((cv) => cv.id !== cvId))
        toast.success("CV deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting CV:", error)
      toast.error("Failed to delete CV. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">My CVs</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your created CVs</p>
          </div>

          <Link
            to="/create-cv"
            className="btn btn-primary mt-4 sm:mt-0 flex items-center justify-center sm:justify-start"
          >
            <FaPlus className="mr-2" /> Create New CV
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin h-8 w-8 text-primary-500" />
        </div>
      ) : cvs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't created any CVs yet.</p>
          <Link to="/create-cv" className="btn btn-primary inline-flex items-center">
            <FaPlus className="mr-2" /> Create Your First CV
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <CVCard key={cv.id} cv={cv} onDelete={handleDeleteCV} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCVs

