"use client";

import { useState, useEffect } from "react";
import CVCard from "./CVCard";

const PublicCVGallery = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        setLoading(true);

        // Use mock data for development until the API endpoint is properly configured
        // In production, uncomment the axios call and use your actual API endpoint

        // const response = await axios.get(`${API_BASE_URL}/cvs/public`);
        // setCvs(response.data.cvs);

        // Mock data for development
        setTimeout(() => {
          setCvs(mockCVs);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching public CVs:", err);
        setError("Failed to load CVs. Please try again later.");
        setLoading(false);

        // Fallback to mock data in case of error
        setCvs(mockCVs);
      }
    };

    fetchCVs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-sm bg-white"
          >
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
              <div className="flex justify-between gap-2">
                <div className="h-10 bg-gray-200 rounded animate-pulse flex-1"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cvs.map((cv) => (
        <CVCard key={cv.id || cv._id} cv={cv} />
      ))}
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
    user: { name: "John Doe" },
    previewImage: "https://via.placeholder.com/400x300",
  },
  {
    id: "2",
    title: "Graphic Designer Portfolio",
    template: "Creative",
    created_at: "2023-06-22T14:45:00Z",
    user: { name: "Jane Smith" },
    previewImage: "https://via.placeholder.com/400x300",
  },
  {
    id: "3",
    title: "Marketing Specialist Resume",
    template: "Classic",
    created_at: "2023-04-10T09:15:00Z",
    user: { name: "Robert Johnson" },
    previewImage: "https://via.placeholder.com/400x300",
  },
  {
    id: "4",
    title: "Data Scientist CV",
    template: "Minimal",
    created_at: "2023-07-05T16:20:00Z",
    user: { name: "Emily Chen" },
    previewImage: "https://via.placeholder.com/400x300",
  },
  {
    id: "5",
    title: "Product Manager Resume",
    template: "Professional",
    created_at: "2023-03-18T11:50:00Z",
    user: { name: "Michael Brown" },
    previewImage: "https://via.placeholder.com/400x300",
  },
  {
    id: "6",
    title: "UX Designer Portfolio",
    template: "Creative",
    created_at: "2023-06-30T13:10:00Z",
    user: { name: "Sarah Wilson" },
    previewImage: "https://via.placeholder.com/400x300",
  },
  {
    id: "7",
    title: "Frontend Developer CV",
    template: "Modern",
    created_at: "2023-05-25T15:35:00Z",
    user: { name: "David Lee" },
    previewImage: "https://via.placeholder.com/400x300",
  },
  {
    id: "8",
    title: "Project Manager Resume",
    template: "Classic",
    created_at: "2023-04-28T10:05:00Z",
    user: { name: "Lisa Taylor" },
    previewImage: "https://via.placeholder.com/400x300",
  },
];

export default PublicCVGallery;
