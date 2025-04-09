"use client";

import { useEffect, useState } from "react";
import { Plus, Filter, Search, Edit, Trash2 } from "lucide-react";
import { getJobs, deleteJob } from "../services/jobService";
import PostJobForm from "../components/jobs/PostJobForm";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleDelete = async (id) => {
    await deleteJob(id);
    fetchJobs();
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClassName = (status) => {
    switch (status) {
      case "Active":
        return "bg-success-50 text-success-700";
      case "Closed":
        return "bg-secondary-100 text-secondary-700";
      case "Draft":
        return "bg-warning-50 text-warning-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Job Listings
          </h1>
          <p className="text-secondary-600">
            Manage your job postings and track applicants
          </p>
        </div>

        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} />
          <span>{showForm ? "Close Form" : "Post New Job"}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-card p-6">
          <PostJobForm
            onSuccess={() => {
              fetchJobs();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500"
              size={18}
            />
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
                    <div className="text-sm font-medium text-secondary-900">
                      {job.title}
                    </div>
                    <div className="text-xs text-secondary-500">
                      {job.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                    {job.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                    {job.salary}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                    {job.applicantsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-danger-500 hover:text-danger-700"
                        onClick={() => handleDelete(job.id)}
                      >
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
  );
};

export default JobListings;
