"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { FaSpinner, FaArrowLeft, FaDownload, FaTrash } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { formatDate } from "../utils/formatDate"

const ViewCV = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cv, setCv] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch CV on component mount
  useEffect(() => {
    fetchCV()
  }, [id])

  // Fetch CV from API
  const fetchCV = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/cvs/${id}`)

      if (response.data.success) {
        setCv(response.data.cv)
      }
    } catch (error) {
      console.error("Error fetching CV:", error)
      toast.error("Failed to load CV. Please try again.")
      navigate("/my-cvs")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete CV
  const handleDeleteCV = async () => {
    if (!confirm("Are you sure you want to delete this CV?")) {
      return
    }

    try {
      const response = await axios.delete(`/api/cvs/${id}`)

      if (response.data.success) {
        toast.success("CV deleted successfully!")
        navigate("/my-cvs")
      }
    } catch (error) {
      console.error("Error deleting CV:", error)
      toast.error("Failed to delete CV. Please try again.")
    }
  }

  // Check if user can delete this CV
  const canDelete = user?.role === "user" && cv?.user_id === user?.id

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin h-8 w-8 text-primary-500" />
      </div>
    )
  }

  if (!cv) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">CV not found or you do not have permission to view it.</p>
        <Link to="/my-cvs" className="btn btn-primary">
          Back to My CVs
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Link
                to={user?.role === "user" ? "/my-cvs" : "/get-hired"}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-2"
              >
                <FaArrowLeft />
              </Link>
              <h1 className="text-2xl font-bold">{cv.title}</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Created: {formatDate(cv.created_at)}</p>
          </div>

          <div className="flex space-x-2 mt-4 sm:mt-0">
            <a
              href={cv.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex items-center"
              download
            >
              <FaDownload className="mr-2" /> Download PDF
            </a>

            {canDelete && (
              <button onClick={handleDeleteCV} className="btn btn-danger flex items-center">
                <FaTrash className="mr-2" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CV Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Personal Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-2">{cv.personalInfo.full_name}</h2>
          <div className="flex flex-wrap justify-center gap-x-4 text-gray-600 dark:text-gray-400 text-sm">
            <p>{cv.personalInfo.email}</p>
            {cv.personalInfo.phone && <p>{cv.personalInfo.phone}</p>}
            {cv.personalInfo.address && <p>{cv.personalInfo.address}</p>}
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 text-primary-600 dark:text-primary-400 text-sm mt-2">
            {cv.personalInfo.linkedin && (
              <a href={cv.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {cv.personalInfo.github && (
              <a href={cv.personalInfo.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {cv.personalInfo.website && (
              <a href={cv.personalInfo.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {cv.personalInfo.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
              Professional Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{cv.personalInfo.summary}</p>
          </div>
        )}

        {/* Education */}
        {cv.education && cv.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Education</h3>
            <div className="space-y-4">
              {cv.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-medium">
                    {edu.degree} in {edu.field_of_study}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{edu.institution}</p>
                  {edu.start_date && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Present"}
                    </p>
                  )}
                  {edu.gpa && <p className="text-gray-600 dark:text-gray-400 text-sm">GPA: {edu.gpa}</p>}
                  {edu.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {cv.experience && cv.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
              Work Experience
            </h3>
            <div className="space-y-4">
              {cv.experience.map((exp, index) => (
                <div key={index}>
                  <h4 className="font-medium">{exp.position}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{exp.company}</p>
                  {exp.start_date && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : exp.end_date ? formatDate(exp.end_date) : "N/A"}
                    </p>
                  )}
                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {cv.skills && cv.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 text-sm"
                >
                  {skill.name} ({skill.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cv.projects && cv.projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Projects</h3>
            <div className="space-y-4">
              {cv.projects.map((project, index) => (
                <div key={index}>
                  <h4 className="font-medium">{project.name}</h4>
                  {project.start_date && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : "Present"}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{project.description}</p>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 text-sm hover:underline mt-1 inline-block"
                    >
                      Project Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {cv.categories && cv.categories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {cv.categories.map((category) => (
                <span
                  key={category.id}
                  className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Suggestions (only visible to CV owner) */}
      {canDelete && cv.ai_suggestions && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>

          <div className="space-y-4">
            {(() => {
              try {
                const suggestions = JSON.parse(cv.ai_suggestions)

                return (
                  <>
                    {suggestions.summary && (
                      <div>
                        <h4 className="text-md font-medium">Suggested Summary</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                          {suggestions.summary}
                        </p>
                      </div>
                    )}

                    {suggestions.careerPaths && (
                      <div>
                        <h4 className="text-md font-medium">Career Path Suggestions</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {suggestions.careerPaths.map((path, index) => (
                            <li key={index}>{path}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {suggestions.skillsToAcquire && (
                      <div>
                        <h4 className="text-md font-medium">Skills to Acquire</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {suggestions.skillsToAcquire.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {suggestions.improvements && (
                      <div>
                        <h4 className="text-md font-medium">CV Improvements</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {suggestions.improvements.map((improvement, index) => (
                            <li key={index}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )
              } catch (error) {
                return (
                  <p className="text-gray-600 dark:text-gray-400">
                    AI suggestions are not available in a readable format.
                  </p>
                )
              }
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewCV

