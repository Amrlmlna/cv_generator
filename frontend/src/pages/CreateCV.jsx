"use client";

import { useNavigate } from "react-router-dom";
import CVForm from "../components/CVForm";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const CreateCV = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Handle successful CV creation
  const handleCVCreated = (cv) => {
    navigate(`/my-cvs`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Create New CV</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in your information to create a professional CV. You can preview
          your CV as you build it.
        </p>
      </div>

      <CVForm onSubmitSuccess={handleCVCreated} />
    </div>
  );
};

export default CreateCV;
