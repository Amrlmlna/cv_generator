"use client"

import { useState } from "react"
import { Plus, Filter, Search, Edit, Trash2 } from "lucide-react"

const JobListings = () => {
  // Mock job listings
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100,000 - $130,000",
      status: "Active",
      applicantsCount: 8,
      createdAt: "2023-04-15",
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      status: "Active",
      applicantsCount: 5,
      createdAt: "2023-04-20",
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$85,000 - $110,000",
      status: "Closed",
      applicantsCount: 12,
      createdAt: "2023-03-10",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Contract",
      salary: "$95,000 - $115,000",
      status: "Draft",
      applicantsCount: 0,
      createdAt: "2023-04-25",
    },
    {
      id: 5,
      title: "Product Manager",
      company: "TechCorp Inc.",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$110,000 - $140,000",
      status: "Active",
      applicantsCount: 6,
      createdAt: "2023-04-18",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusClassName = (status) => {
    switch (status) {
      case "Active":
        return "bg-success-50 text-success-700"
      case "Closed":
        return "bg-secondary-100 text-secondary-700"
      case "Draft":
        return "bg-warning-50 text-warning-700"
      default:
        return "bg-secondary-100 text-secondary-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Job Listings</h1>
          <p className="text-secondary-600">Manage your job postings and track applicants</p>
        </div>

        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500" size={18} />
            <input
              type="text"
              placeholder="Search jobs..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="btn btn-outline flex items-center gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Job listings table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Applicants
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-secondary-900">{job.title}</div>
                    <div className="text-xs text-secondary-500">{job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">{job.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">{job.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">{job.salary}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">{job.applicantsCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        <Edit size={16} />
                      </button>
                      <button className="text-danger-500 hover:text-danger-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-secondary-600">No job listings found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobListings

