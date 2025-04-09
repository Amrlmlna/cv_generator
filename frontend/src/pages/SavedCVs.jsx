"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { getUserCVs, deleteCV, getCVDownloadUrl } from "../services/cvService"
import { FileText, Download, Trash2 } from "lucide-react"

const SavedCVs = () => {
  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCVs()
  }, [])

  const fetchCVs = async () => {
    try {
      setLoading(true)
      const response = await getUserCVs()
      setCvs(response.data)
    } catch (err) {
      setError("Failed to load your saved CVs")
      toast.error("Failed to load your saved CVs")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cvId) => {
    if (!confirm("Are you sure you want to delete this CV?")) return

    try {
      await deleteCV(cvId)
      setCvs(cvs.filter((cv) => cv.id !== cvId))
      toast.success("CV deleted successfully")
    } catch (err) {
      toast.error("Failed to delete CV")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-danger-50 text-danger-700 p-4 rounded-md">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Saved CVs</h1>
        <p className="text-secondary-600">View and manage your saved CVs</p>
      </div>

      {cvs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <div className="flex justify-center mb-4">
            <FileText size={48} className="text-secondary-400" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">No CVs Found</h2>
          <p className="text-secondary-600 mb-6">You haven't saved any CVs yet. Create your first CV to get started.</p>
          <Link to="/cv-builder" className="btn btn-primary">
            Create CV
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <div key={cv.id} className="bg-white rounded-lg shadow-card overflow-hidden border border-secondary-200">
              <div className="aspect-w-4 aspect-h-3 bg-secondary-100">
                <img src={cv.image_url || "/placeholder.svg"} alt={cv.title} className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-secondary-900 mb-1">{cv.title}</h3>
                <p className="text-xs text-secondary-500">Created on {new Date(cv.created_at).toLocaleDateString()}</p>

                <div className="flex justify-between mt-4 pt-4 border-t border-secondary-200">
                  <a
                    href={getCVDownloadUrl(cv.id)}
                    className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    download
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={() => handleDelete(cv.id)}
                    className="text-danger-500 hover:text-danger-700 flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedCVs

