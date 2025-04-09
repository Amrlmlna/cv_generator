"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getUserCVs,
  deleteCV,
  updateCVVisibility,
  getCV,
} from "../services/cvService";
import { FileText, Trash2, Eye, EyeOff, Printer } from "lucide-react";
import ProfessionalTemplate from "../components/cv-builder/cv-templates/ProfessionalTemplate";
import ModernTemplate from "../components/cv-builder/cv-templates/ModernTemplate";

const SavedCVs = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const printFrameRef = useRef(null);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await getUserCVs();
      setCvs(response.data);
    } catch (err) {
      setError("Failed to load your saved CVs");
      toast.error("Failed to load your saved CVs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cvId) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
      await deleteCV(cvId);
      setCvs(cvs.filter((cv) => cv.id !== cvId));
      toast.success("CV deleted successfully");
    } catch (err) {
      toast.error("Failed to delete CV");
    }
  };

  const handleToggleVisibility = async (cv) => {
    try {
      const newVisibility = cv.visibility === "public" ? "private" : "public";
      await updateCVVisibility(cv.id, newVisibility);

      // Update local state
      setCvs(
        cvs.map((item) =>
          item.id === cv.id ? { ...item, visibility: newVisibility } : item
        )
      );

      toast.success(`CV is now ${newVisibility}`);
    } catch (err) {
      toast.error("Failed to update CV visibility");
    }
  };

  const handlePrint = async (cvId) => {
    try {
      setIsPrinting(true);
      // Fetch the CV data
      const response = await getCV(cvId);
      const cv = response.data;

      // If there's a PDF file available, open it in a new window
      if (cv.file_url && cv.file_url.endsWith(".pdf")) {
        window.open(cv.file_url, "_blank");
        setIsPrinting(false);
        return;
      }

      // Otherwise, parse the CV data and print it
      let cvData = null;
      try {
        if (cv.cv_data) {
          cvData = JSON.parse(cv.cv_data);
        }
      } catch (e) {
        console.error("Error parsing CV data:", e);
        toast.error("Error parsing CV data");
        setIsPrinting(false);
        return;
      }

      if (!cvData) {
        toast.error("CV data not found");
        setIsPrinting(false);
        return;
      }

      setSelectedCV({
        ...cv,
        parsedData: cvData,
      });

      // Use setTimeout to ensure the CV content is rendered before printing
      setTimeout(() => {
        window.print();
        // Reset after printing
        setTimeout(() => {
          setIsPrinting(false);
          setSelectedCV(null);
        }, 500);
      }, 500);
    } catch (err) {
      toast.error("Failed to prepare CV for download");
      setIsPrinting(false);
    }
  };

  const renderCVTemplate = () => {
    if (!selectedCV || !selectedCV.parsedData) {
      return <div className="text-center p-8">No CV data available</div>;
    }

    // Render the appropriate template based on the stored data
    const { templateId } = selectedCV.parsedData;

    switch (templateId) {
      case "professional":
        return <ProfessionalTemplate {...selectedCV.parsedData} />;
      case "modern":
        return <ModernTemplate {...selectedCV.parsedData} />;
      default:
        return <ProfessionalTemplate {...selectedCV.parsedData} />;
    }
  };

  // Generate a preview thumbnail from CV data
  const renderCVThumbnail = (cv) => {
    try {
      if (!cv.cv_data) return null;

      const cvData = JSON.parse(cv.cv_data);
      const { personalInfo } = cvData;

      return (
        <div
          className="p-3 bg-white text-xs overflow-hidden"
          style={{
            transform: "scale(0.5)",
            transformOrigin: "top left",
            height: "200%",
            width: "200%",
          }}
        >
          <h2 className="font-bold text-lg">
            {personalInfo?.fullName || "Unnamed"}
          </h2>
          <p className="text-gray-600">{personalInfo?.title || ""}</p>
          {personalInfo?.email && <p>{personalInfo.email}</p>}
        </div>
      );
    } catch (e) {
      console.error("Error rendering thumbnail:", e);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 text-danger-700 p-4 rounded-md">{error}</div>
    );
  }

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Saved CVs</h1>
          <p className="text-secondary-600">View and manage your saved CVs</p>
        </div>

        {cvs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <div className="flex justify-center mb-4">
              <FileText size={48} className="text-secondary-400" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              No CVs Found
            </h2>
            <p className="text-secondary-600 mb-6">
              You haven't saved any CVs yet. Create your first CV to get
              started.
            </p>
            <Link to="/cv-builder" className="btn btn-primary">
              Create CV
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white rounded-lg shadow-card overflow-hidden border border-secondary-200"
              >
                <div className="aspect-w-4 aspect-h-3 bg-secondary-100 overflow-hidden">
                  {cv.file_url ? (
                    <img
                      src={cv.file_url || "/placeholder.svg"}
                      alt={cv.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    renderCVThumbnail(cv) || (
                      <div className="flex items-center justify-center h-full bg-secondary-100 text-secondary-400">
                        <FileText size={48} />
                      </div>
                    )
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {cv.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        cv.visibility === "public"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {cv.visibility || "private"}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-500">
                    Created on {new Date(cv.created_at).toLocaleDateString()}
                  </p>

                  <div className="flex justify-between mt-4 pt-4 border-t border-secondary-200">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePrint(cv.id)}
                        className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        <Printer size={16} />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(cv)}
                        className="text-secondary-600 hover:text-secondary-800 flex items-center gap-1"
                        title={
                          cv.visibility === "public"
                            ? "Make private"
                            : "Make public"
                        }
                      >
                        {cv.visibility === "public" ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="text-danger-500 hover:text-danger-700 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print content - only visible when printing */}
      {selectedCV && (
        <div
          ref={printFrameRef}
          className="hidden print:block p-0 m-0"
          style={{ width: "100%", height: "100%" }}
        >
          {renderCVTemplate()}
        </div>
      )}

      {/* Add print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default SavedCVs;
