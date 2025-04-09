"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import useCV from "../../store/cvStore"

const CVCertificates = () => {
  const { certificates, setCertificates } = useCV()
  const [editing, setEditing] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(null)
  const [certificateList, setCertificateList] = useState(certificates)
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    date: "",
    url: "",
  })

  useEffect(() => {
    setCertificateList(certificates)
  }, [certificates])

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
      const newCertificates = [...certificateList]
      newCertificates[currentIndex] = formData
      setCertificateList(newCertificates)
      setCertificates(newCertificates)
    } else {
      const newCertificates = [...certificateList, formData]
      setCertificateList(newCertificates)
      setCertificates(newCertificates)
    }

    resetForm()
  }

  const handleEdit = (index) => {
    setEditing(true)
    setCurrentIndex(index)
    setFormData(certificateList[index])
  }

  const handleDelete = (index) => {
    const newCertificates = certificateList.filter((_, i) => i !== index)
    setCertificateList(newCertificates)
    setCertificates(newCertificates)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      issuer: "",
      date: "",
      url: "",
    })
    setEditing(false)
    setCurrentIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* List of certificates */}
      {certificateList.length > 0 && (
        <div className="space-y-4">
          {certificateList.map((item, index) => (
            <div key={index} className="bg-secondary-50 p-4 rounded-md border border-secondary-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-secondary-900">{item.name}</h3>
                  <p className="text-sm text-secondary-700">{item.issuer}</p>
                  {item.date && <p className="text-xs text-secondary-600 mt-1">{item.date}</p>}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:underline mt-1 inline-block"
                    >
                      View Certificate
                    </a>
                  )}
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

      {/* Form for adding/editing certificates */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="form-label">
              Certificate Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., AWS Certified Solutions Architect"
            />
          </div>

          <div>
            <label htmlFor="issuer" className="form-label">
              Issuing Organization
            </label>
            <input
              id="issuer"
              name="issuer"
              type="text"
              className="input"
              value={formData.issuer}
              onChange={handleChange}
              required
              placeholder="e.g., Amazon Web Services"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="form-label">
              Issue Date
            </label>
            <input id="date" name="date" type="month" className="input" value={formData.date} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="url" className="form-label">
              Certificate URL (optional)
            </label>
            <input
              id="url"
              name="url"
              type="url"
              className="input"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com/certificate"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {editing && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}

          <button type="submit" className="btn btn-primary">
            {editing ? "Update" : "Add"} Certificate
          </button>
        </div>
      </form>

      {/* Add certificate button */}
      {!editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <Plus size={16} />
          <span>Add Certificate</span>
        </button>
      )}
    </div>
  )
}

export default CVCertificates

