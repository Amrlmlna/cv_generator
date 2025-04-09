"use client"

import { useState } from "react"
import { Search, Filter, Eye, User, Briefcase, GraduationCap, MapPin } from "lucide-react"

const Candidates = () => {
  // Mock candidates data
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "John Doe",
      title: "Frontend Developer",
      location: "New York, NY",
      skills: ["React", "TypeScript", "CSS", "HTML"],
      experience: "5 years",
      education: "BS Computer Science",
      status: "Applied",
      appliedDate: "2023-04-20",
    },
    {
      id: 2,
      name: "Jane Smith",
      title: "UX Designer",
      location: "San Francisco, CA",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      experience: "3 years",
      education: "BFA Design",
      status: "Shortlisted",
      appliedDate: "2023-04-18",
    },
    {
      id: 3,
      name: "Mike Johnson",
      title: "Backend Developer",
      location: "Remote",
      skills: ["Node.js", "Express", "MongoDB", "AWS"],
      experience: "4 years",
      education: "MS Information Technology",
      status: "Interview",
      appliedDate: "2023-04-15",
    },
    {
      id: 4,
      name: "Sarah Williams",
      title: "Full Stack Developer",
      location: "Boston, MA",
      skills: ["React", "Node.js", "SQL", "REST API"],
      experience: "6 years",
      education: "BS Software Engineering",
      status: "Offered",
      appliedDate: "2023-04-10",
    },
    {
      id: 5,
      name: "Robert Brown",
      title: "DevOps Engineer",
      location: "Chicago, IL",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      experience: "7 years",
      education: "BS Computer Engineering",
      status: "Rejected",
      appliedDate: "2023-04-05",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = selectedStatus === "All" || candidate.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusClassName = (status) => {
    switch (status) {
      case "Applied":
        return "bg-secondary-100 text-secondary-700"
      case "Shortlisted":
        return "bg-primary-100 text-primary-700"
      case "Interview":
        return "bg-warning-50 text-warning-700"
      case "Offered":
        return "bg-success-50 text-success-700"
      case "Rejected":
        return "bg-danger-50 text-danger-700"
      default:
        return "bg-secondary-100 text-secondary-700"
    }
  }

  const statusOptions = ["All", "Applied", "Shortlisted", "Interview", "Offered", "Rejected"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Candidates</h1>
        <p className="text-secondary-600">View and manage job applicants</p>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, job title, or skills..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="status" className="text-sm font-medium text-secondary-700 whitespace-nowrap">
              Status:
            </label>
            <select
              id="status"
              className="input py-2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-outline flex items-center gap-2">
            <Filter size={16} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Candidates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white rounded-lg shadow-card overflow-hidden border border-secondary-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{candidate.name}</h3>
                    <p className="text-secondary-600">{candidate.title}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClassName(candidate.status)}`}
                >
                  {candidate.status}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <MapPin size={16} className="text-secondary-500" />
                  <span>{candidate.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Briefcase size={16} className="text-secondary-500" />
                  <span>{candidate.experience} experience</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <GraduationCap size={16} className="text-secondary-500" />
                  <span>{candidate.education}</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-secondary-200 flex justify-between items-center">
                <span className="text-xs text-secondary-500">Applied on {candidate.appliedDate}</span>
                <button className="btn btn-outline btn-sm flex items-center gap-1.5">
                  <Eye size={14} />
                  <span>View CV</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <p className="text-secondary-600">No candidates found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

export default Candidates

