"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
} from "lucide-react";
import applicationService from "../services/application";
import { toast } from "react-hot-toast";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (id, status) => {
    try {
      await applicationService.updateApplicationStatus(id, status);
      toast.success(`Candidate status updated to ${status}`);
      fetchCandidates(); // Refresh the list
    } catch (error) {
      console.error("Failed to update candidate status:", error);
      toast.error("Failed to update candidate status");
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      selectedStatus === "All" || candidate.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusClassName = (status) => {
    switch (status) {
      case "Applied":
        return "bg-secondary-100 text-secondary-700";
      case "Shortlisted":
        return "bg-primary-100 text-primary-700";
      case "Interview":
        return "bg-warning-50 text-warning-700";
      case "Offered":
        return "bg-success-50 text-success-700";
      case "Rejected":
        return "bg-danger-50 text-danger-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const statusOptions = [
    "All",
    "Applied",
    "Shortlisted",
    "Interview",
    "Offered",
    "Rejected",
  ];

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
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, job title, or skills..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-secondary-700 whitespace-nowrap"
            >
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
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
                        <h3 className="font-semibold text-secondary-900">
                          {candidate.name}
                        </h3>
                        <p className="text-secondary-600">{candidate.title}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClassName(
                          candidate.status
                        )}`}
                      >
                        {candidate.status}
                      </span>
                      <p className="text-xs text-secondary-500 mt-1">
                        {candidate.jobTitle &&
                          `Applied for: ${candidate.jobTitle}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <MapPin size={16} className="text-secondary-500" />
                      <span>{candidate.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <Briefcase size={16} className="text-secondary-500" />
                      <span>{candidate.experience}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <GraduationCap size={16} className="text-secondary-500" />
                      <span>{candidate.education}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-md text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-secondary-200 flex justify-between items-center">
                    <span className="text-xs text-secondary-500">
                      Applied on {candidate.appliedDate}
                    </span>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm flex items-center gap-1.5">
                        <Eye size={14} />
                        <span>View CV</span>
                      </button>
                      <select
                        className="input input-sm py-1"
                        value={candidate.status}
                        onChange={(e) =>
                          updateCandidateStatus(candidate.id, e.target.value)
                        }
                      >
                        {statusOptions
                          .filter((status) => status !== "All")
                          .map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="bg-white rounded-lg shadow-card p-8 text-center">
              <p className="text-secondary-600">
                No candidates found matching your filters.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Candidates;
