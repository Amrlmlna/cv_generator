"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CVCard from "../components/CVCard";
import { useAuth } from "../context/AuthContext";

const MyCVs = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/cvs", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });

        console.log("CV data received:", response.data); // Debug log

        if (response.data.success) {
          // Ensure we have valid CV data
          const validCvs = response.data.cvs.filter(
            (cv) => cv && typeof cv === "object"
          );
          console.log("Filtered valid CVs:", validCvs); // Debug log
          setCvs(validCvs);
        } else {
          setError("Failed to fetch CVs");
        }
      } catch (err) {
        console.error("Error fetching CVs:", err);
        setError(err.response?.data?.message || "Failed to fetch CVs");
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My CVs</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your created CVs and templates
            </p>
          </div>
          <Link
            to="/create-cv"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New CV
          </Link>
        </div>
      </div>

      {cvs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't created any CVs yet.
          </p>
          <Link
            to="/create-cv"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            Create Your First CV
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv, index) => (
            <CVCard key={cv.id || index} cv={cv} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCVs;
