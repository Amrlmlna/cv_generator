"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

const GetHired = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    // In a real implementation, this would fetch from your API
    // For now, we'll use mock data
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockJobs = [
        {
          id: 1,
          title: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          location: "New York, NY",
          type: "Full-time",
          salary: "$100,000 - $130,000",
          description:
            "We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern CSS frameworks.",
          requirements:
            "5+ years of experience with modern JavaScript frameworks, strong TypeScript skills, and experience with responsive design.",
          postedDate: "2023-04-15",
        },
        {
          id: 2,
          title: "Backend Engineer",
          company: "DataSystems LLC",
          location: "Remote",
          type: "Full-time",
          salary: "$90,000 - $120,000",
          description:
            "Join our team to build scalable backend services using Node.js, Express, and MongoDB.",
          requirements:
            "3+ years of experience with Node.js, knowledge of database design, and RESTful API development.",
          postedDate: "2023-04-20",
        },
        {
          id: 3,
          title: "UX/UI Designer",
          company: "Creative Solutions",
          location: "San Francisco, CA",
          type: "Full-time",
          salary: "$85,000 - $110,000",
          description:
            "Design intuitive and engaging user experiences for web and mobile applications.",
          requirements:
            "Portfolio demonstrating UX/UI design skills, proficiency in Figma or Adobe XD, and understanding of user-centered design principles.",
          postedDate: "2023-03-10",
        },
        {
          id: 4,
          title: "DevOps Engineer",
          company: "CloudTech Services",
          location: "Remote",
          type: "Contract",
          salary: "$95,000 - $115,000",
          description:
            "Implement and maintain CI/CD pipelines, manage cloud infrastructure, and optimize deployment processes.",
          requirements:
            "Experience with AWS/Azure, Docker, Kubernetes, and CI/CD tools like Jenkins or GitHub Actions.",
          postedDate: "2023-04-25",
        },
        {
          id: 5,
          title: "Product Manager",
          company: "InnovateTech",
          location: "Boston, MA",
          type: "Full-time",
          salary: "$110,000 - $140,000",
          description:
            "Lead product development from conception to launch, working closely with design, engineering, and marketing teams.",
          requirements:
            "3+ years of product management experience, strong analytical skills, and excellent communication abilities.",
          postedDate: "2023-04-18",
        },
      ];

      setJobs(mockJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job listings");
    } finally {
      setLoading(false);
    }
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
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Boston">Boston</option>
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
                        <span>{getDaysAgo(job.postedDate)} days ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-medium text-secondary-900">
                      {job.salary}
                    </div>
                    <button className="btn btn-primary mt-2">Apply Now</button>
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
