"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import useCV from "../../store/cvStore"

const CVEducation = () => {
  const { education, addEducation, updateEducation, removeEducation } = useCV()
  const [editing, setEditing] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(null)
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
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
      updateEducation(currentIndex, formData)
    } else {
      addEducation(formData)
    }

    resetForm()
  }

  const handleEdit = (index) => {
    setEditing(true)
    setCurrentIndex(index)
    setFormData(education[index])
  }

  const handleDelete = (index) => {
    removeEducation(index)
  }

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    })
    setEditing(false)
    setCurrentIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* List of education entries */}
      {education.length > 0 && (
        <div className="space-y-4">
          {education.map((item, index) => (
            <div key={index} className="bg-secondary-50 p-4 rounded-md border border-secondary-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-secondary-900">{item.institution}</h3>
                  <p className="text-sm text-secondary-700">
                    {item.degree}
                    {item.field ? `, ${item.field}` : ""}
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

      {/* Form for adding/editing education */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="institution" className="form-label">
              Institution
            </label>
            <input
              id="institution"
              name="institution"
              type="text"
              className="input"
              value={formData.institution}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="degree" className="form-label">
              Degree
            </label>
            <input
              id="degree"
              name="degree"
              type="text"
              className="input"
              value={formData.degree}
              onChange={handleChange}
              required
              placeholder="e.g. Bachelor's, Master's, PhD"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field" className="form-label">
              Field of Study
            </label>
            <input
              id="field"
              name="field"
              type="text"
              className="input"
              value={formData.field}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
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
            rows="3"
            className="input"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional information about your studies, achievements, etc."
          ></textarea>
        </div>

        <div className="flex justify-end gap-2">
          {editing && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}

          <button type="submit" className="btn btn-primary">
            {editing ? "Update" : "Add"} Education
          </button>
        </div>
      </form>

      {/* Add education button */}
      {!editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <Plus size={16} />
          <span>Add Education</span>
        </button>
      )}
    </div>
  )
}

export default CVEducation

