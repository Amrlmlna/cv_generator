"use client"

import { useState, useEffect } from "react"
import { FaSearch, FaFilter } from "react-icons/fa"
import axios from "axios"

const CVFilter = ({ onFilter }) => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories")
        if (response.data.success) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // Handle filter submission
  const handleSubmit = (e) => {
    e.preventDefault()

    onFilter({
      category: selectedCategory,
      search: searchTerm,
    })
  }

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory("")
    setSearchTerm("")

    onFilter({
      category: "",
      search: "",
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Filter CVs</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="form-label">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or skills..."
              className="form-input pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="form-input pl-10 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button type="submit" className="btn btn-primary flex-1">
            Apply Filters
          </button>
          <button type="button" onClick={clearFilters} className="btn btn-outline">
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default CVFilter

