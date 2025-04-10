"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import jobService from "../services/jobService";
import applicationService from "../services/application";
import cvService from "../services/cvService";
import { useAuth } from "../contexts/AuthContext";

const GetHired = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myCVs, setMyCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [applyingToJobId, setApplyingToJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedCVId, setSelectedCVId] = useState(null);

  useEffect(() => {
    fetchJobs();
    if (currentUser) {
      fetchMyApplications();
      fetchMyCVs();
    }
  }, [currentUser]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job listings");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setMyApplications(data);
    } catch (error) {
      console.error("Error fetching my applications:", error);
    }
  };

  const fetchMyCVs = async () => {
    try {
      const data = await cvService.getMyCVs();
      setMyCVs(data);
      // Set default selected CV to primary CV or first CV
      if (data.length > 0) {
        const primaryCV = data.find(
          (cv) => cv.id === currentUser.primary_cv_id
        );
        setSelectedCVId(primaryCV ? primaryCV.id : data[0].id);
      }
    } catch (error) {
      console.error("Error fetching my CVs:", error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      if (!selectedCVId) {
        toast.error("Please select a CV to apply with");
        return;
      }

      await applicationService.applyToJob({
        job_id: jobId,
        cv_id: selectedCVId,
        cover_letter: coverLetter,
      });

      toast.success("Application submitted successfully!");
      setApplyingToJobId(null);
      setCoverLetter("");
      fetchMyApplications();
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    }
  };

  const handleWithdraw = async (applicationId) => {
    try {
      await applicationService.withdrawApplication(applicationId);
      toast.success("Application withdrawn successfully");
      fetchMyApplications();
    } catch (error) {
      console.error("Error withdrawing application:", error);
      toast.error("Failed to withdraw application");
    }
  };

  // Check if user has already applied to a job
  const hasApplied = (jobId) => {
    return myApplications.some((app) => app.job_id === jobId);
  };

  // Get application ID if user has applied
  const getApplicationId = (jobId) => {
    const application = myApplications.find((app) => app.job_id === jobId);
    return application ? application.id : null;
  };

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = filterLocation
      ? job.location.includes(filterLocation)
      : true;
    const matchesType = filterType ? job.type === filterType : true;

    return matchesSearch && matchesLocation && matchesType;
  });

  // Calculate days ago
  const getDaysAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Get Hired</h1>
        <p className="text-secondary-600">
          Discover job opportunities that match your skills and experience
        </p>
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
              placeholder="Search jobs by title, company, or keywords..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="input py-2"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Surabaya">Surabaya</option>
            </select>

            <select
              className="input py-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job listings */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-card overflow-hidden border border-secondary-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-secondary-900">
                      {job.title}
                    </h2>
                    <p className="text-primary-600 font-medium">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex items-center text-secondary-600">
                        <MapPin size={16} className="mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-secondary-600">
                        <Briefcase size={16} className="mr-1" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center text-secondary-600">
                        <Calendar size={16} className="mr-1" />
                        <span>{getDaysAgo(job.created_at)} days ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-medium text-secondary-900">
                      {job.salary_range}
                    </div>
                    {!currentUser ? (
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => toast.error("Please login to apply")}
                      >
                        Apply Now
                      </button>
                    ) : hasApplied(job.id) ? (
                      <button
                        className="btn btn-outline btn-danger mt-2 flex items-center gap-1"
                        onClick={() => handleWithdraw(getApplicationId(job.id))}
                      >
                        <X size={16} />
                        Withdraw Application
                      </button>
                    ) : applyingToJobId === job.id ? (
                      <div className="mt-2 space-y-2">
                        {myCVs.length > 0 ? (
                          <select
                            className="input w-full"
                            value={selectedCVId}
                            onChange={(e) =>
                              setSelectedCVId(Number(e.target.value))
                            }
                          >
                            {myCVs.map((cv) => (
                              <option key={cv.id} value={cv.id}>
                                {cv.title}{" "}
                                {cv.id === user.primary_cv_id
                                  ? "(Primary)"
                                  : ""}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-danger-500 text-sm">
                            You need to create a CV before applying
                          </div>
                        )}
                        <textarea
                          className="input w-full h-24"
                          placeholder="Add a cover letter (optional)"
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                        ></textarea>
                        <div className="flex gap-2 justify-end">
                          <button
                            className="btn btn-outline"
                            onClick={() => {
                              setApplyingToJobId(null);
                              setCoverLetter("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleApply(job.id)}
                            disabled={myCVs.length === 0}
                          >
                            Submit Application
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => setApplyingToJobId(job.id)}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <p className="text-secondary-700">{job.description}</p>

                  <div className="mt-4">
                    <h3 className="font-medium text-secondary-900">
                      Requirements:
                    </h3>
                    <p className="text-secondary-700">{job.requirements}</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="text-primary-600 hover:text-primary-700 flex items-center">
                      <span>View Details</span>
                      <ExternalLink size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <p className="text-secondary-600">
            No job listings found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default GetHired;
