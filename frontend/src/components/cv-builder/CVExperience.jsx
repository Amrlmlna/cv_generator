"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import useCV from "../../store/cvStore"

const CVExperience = () => {
  const { experience, addExperience, updateExperience, removeExperience } = useCV()
  const [editing, setEditing] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(null)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editing && currentIndex !== null) {
      updateExperience(currentIndex, formData)
    } else {
      addExperience(formData)
    }

    resetForm()
  }

  const handleEdit = (index) => {
    setEditing(true)
    setCurrentIndex(index)
    setFormData(experience[index])
  }

  const handleDelete = (index) => {
    removeExperience(index)
  }

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    })
    setEditing(false)
    setCurrentIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* List of experience entries */}
      {experience.length > 0 && (
        <div className="space-y-4">
          {experience.map((item, index) => (
            <div key={index} className="bg-secondary-50 p-4 rounded-md border border-secondary-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-secondary-900">{item.position}</h3>
                  <p className="text-sm text-secondary-700">
                    {item.company}
                    {item.location ? `, ${item.location}` : ""}
                  </p>
                  <p className="text-xs text-secondary-600 mt-1">
                    {item.startDate} - {item.endDate || "Present"}
                  </p>
                  {item.description && <p className="text-sm mt-2">{item.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="text-secondary-700 hover:text-secondary-900 p-1 rounded-md hover:bg-secondary-200"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="text-danger-500 hover:text-danger-700 p-1 rounded-md hover:bg-secondary-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form for adding/editing experience */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="form-label">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="input"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="position" className="form-label">
              Position
            </label>
            <input
              id="position"
              name="position"
              type="text"
              className="input"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="input"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="month"
                className="input"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="month"
                className="input"
                value={formData.endDate}
                onChange={handleChange}
                placeholder="Leave empty if current"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="input"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your responsibilities and achievements"
          ></textarea>
        </div>

        <div className="flex justify-end gap-2">
          {editing && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}

          <button type="submit" className="btn btn-primary">
            {editing ? "Update" : "Add"} Experience
          </button>
        </div>
      </form>

      {/* Add experience button */}
      {!editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      )}
    </div>
  )
}

export default CVExperience

