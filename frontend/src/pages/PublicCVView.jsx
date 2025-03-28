"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const PublicCVView = () => {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true);

        // Use mock data for development until the API endpoint is properly configured
        // In production, uncomment the axios call and use your actual API endpoint

        // const response = await axios.get(`${API_BASE_URL}/cvs/public/${id}`);
        // setCv(response.data.cv);

        // Mock data for development
        setTimeout(() => {
          // Find mock CV by ID
          const mockCV = mockCVs.find((cv) => cv.id === id);
          if (mockCV) {
            setCv(mockCV);
          } else {
            setError("CV not found");
          }
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching CV:", err);
        setError("Failed to load CV. Please try again later.");
        setLoading(false);
      }
    };

    fetchCV();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-6 w-1/3"></div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-2/3"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index}>
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="mb-6">{error || "CV not found"}</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold">{cv.title}</h1>
          <div className="flex gap-4">
            <Link
              to={`/login?template=${cv.template}&ref=${cv.id}`}
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Use This Template
            </Link>
            <Link
              to={`/contact-candidate/${cv.user.id}`}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
            >
              Contact Candidate
            </Link>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        {/* ... */}
      </div>
    </div>
  );
};

// Mock data for development and testing
const mockCVs = [
  {
    id: "1",
    title: "Software Developer CV",
    template: "Modern",
    created_at: "2023-05-15T10:30:00Z",
    user: {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
    },
    previewImage: "https://via.placeholder.com/800x600",
    sections: [
      {
        title: "Summary",
        content:
          "Experienced software developer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.",
      },
      {
        title: "Experience",
        content:
          "Senior Developer at Tech Co (2020-Present): Led development of multiple web applications, improving performance by 40%.",
      },
      {
        title: "Education",
        content: "BS in Computer Science, University of Technology, 2018",
      },
      {
        title: "Skills",
        content: "JavaScript, React, Node.js, AWS, Docker, MongoDB, SQL, Git",
      },
    ],
  },
  // Add more mock CVs as needed
];

export default PublicCVView;
