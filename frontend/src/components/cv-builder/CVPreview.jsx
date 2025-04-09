"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import useCV from "../../store/cvStore";
import ProfessionalTemplate from "./cv-templates/ProfessionalTemplate";
import ModernTemplate from "./cv-templates/ModernTemplate";
import MinimalistTemplate from "./cv-templates/MinimalistTemplate";
import CreativeTemplate from "./cv-templates/CreativeTemplate";
import ExecutiveTemplate from "./cv-templates/ExecutiveTemplate";
import CompactTemplate from "./cv-templates/CompactTemplate";
import ElegantTemplate from "./cv-templates/ElegantTemplate";
import TechnicalTemplate from "./cv-templates/TechnicalTemplate";
import AcademicTemplate from "./cv-templates/AcademicTemplate";
import ChronologicalTemplate from "./cv-templates/ChronologicalTemplate";
import FunctionalTemplate from "./cv-templates/FunctionalTemplate";
import InfographicTemplate from "./cv-templates/InfographicTemplate";
import cvService from "../../services/cvService";
import { X, Maximize2, Eye, EyeOff } from "lucide-react";

const CVPreview = () => {
  const cvStore = useCV();
  const { templateId } = cvStore;
  const [isSaving, setIsSaving] = useState(false);
  const [cvTitle, setCvTitle] = useState("");
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showFullSizeModal, setShowFullSizeModal] = useState(false);
  const [visibility, setVisibility] = useState("private");
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  const cvRef = useRef(null);

  // Force re-render when CV data changes
  const [, setForceUpdate] = useState(0);

  // Subscribe to store changes to update preview in real-time
  useEffect(() => {
    // This will re-render the component whenever any CV data changes
    const unsubscribe = cvStore.subscribe(() => {
      setForceUpdate((prev) => prev + 1);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [cvStore]);

  const renderTemplate = () => {
    switch (templateId) {
      case "professional":
        return <ProfessionalTemplate showPlaceholders={showPlaceholders} />;
      case "modern":
        return <ModernTemplate showPlaceholders={showPlaceholders} />;
      case "minimalist":
        return <MinimalistTemplate showPlaceholders={showPlaceholders} />;
      case "creative":
        return <CreativeTemplate showPlaceholders={showPlaceholders} />;
      case "executive":
        return <ExecutiveTemplate showPlaceholders={showPlaceholders} />;
      case "compact":
        return <CompactTemplate showPlaceholders={showPlaceholders} />;
      case "elegant":
        return <ElegantTemplate showPlaceholders={showPlaceholders} />;
      case "technical":
        return <TechnicalTemplate showPlaceholders={showPlaceholders} />;
      case "academic":
        return <AcademicTemplate showPlaceholders={showPlaceholders} />;
      case "chronological":
        return <ChronologicalTemplate showPlaceholders={showPlaceholders} />;
      case "functional":
        return <FunctionalTemplate showPlaceholders={showPlaceholders} />;
      case "infographic":
        return <InfographicTemplate showPlaceholders={showPlaceholders} />;
      default:
        return <ProfessionalTemplate showPlaceholders={showPlaceholders} />;
    }
  };

  const handleSaveToBackend = async () => {
    // If CV title is not set, show the input field
    if (!showTitleInput) {
      setShowTitleInput(true);
      return;
    }

    // Validate CV title
    if (!cvTitle.trim()) {
      toast.error("Please enter a title for your CV");
      return;
    }

    setIsSaving(true);

    try {
      // Get CV data directly from the store
      const cvData = JSON.stringify(cvStore);

      // Create form data with CV data
      const formData = new FormData();
      formData.append("title", cvTitle);
      formData.append("visibility", visibility);
      formData.append("cvData", cvData);

      // For debugging
      console.log("Sending data:", {
        title: cvTitle,
        visibility,
        cvData: cvData.substring(0, 100) + "...", // Log just the beginning to avoid huge logs
      });

      // Use cvService.uploadCV instead of uploadCV
      const response = await cvService.uploadCV(formData);

      toast.success("CV saved successfully!");
      setShowTitleInput(false);
      setCvTitle("");
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error(
        error.response?.data?.message || "Failed to save CV. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPlaceholders(!showPlaceholders)}
            className="btn btn-outline text-sm flex items-center gap-1"
            title={showPlaceholders ? "Hide placeholders" : "Show placeholders"}
          >
            {showPlaceholders ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPlaceholders ? "Hide Placeholders" : "Show Placeholders"}
          </button>
          <button
            onClick={() => setShowFullSizeModal(true)}
            className="btn btn-outline text-sm flex items-center gap-1"
          >
            <Maximize2 size={16} />
            View Full Size
          </button>
          <button
            onClick={handleSaveToBackend}
            disabled={isSaving}
            className="btn btn-primary text-sm flex items-center gap-1"
          >
            {isSaving ? "Saving..." : "Save CV"}
          </button>
        </div>
      </div>

      {showTitleInput && (
        <div className="bg-secondary-50 p-4 rounded-md border border-secondary-200">
          <label htmlFor="cvTitle" className="form-label">
            CV Title
          </label>
          <input
            id="cvTitle"
            type="text"
            className="input w-full mb-3"
            value={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
            placeholder="Enter a title for your CV"
          />

          <div className="mb-3">
            <label className="form-label">Visibility</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="radio"
                />
                <span>Private</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="radio"
                />
                <span>Public</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowTitleInput(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveToBackend}
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Updated preview container with proper scaling */}
      <div className="border border-secondary-200 rounded-lg overflow-hidden shadow-sm bg-white">
        <div
          className="w-full flex justify-center items-center"
          style={{ height: "550px" }}
        >
          <div
            className="w-[21cm] origin-top"
            style={{
              transform: "scale(0.30)",
              height: "29.7cm", // A4 height
              transformOrigin: "top center",
              marginTop: "600px", // Add margin to prevent top from being cut off
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
            ref={cvRef}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Full-size modal */}
      {showFullSizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">CV Preview</h3>
              <button
                onClick={() => setShowFullSizeModal(false)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="overflow-auto flex-1 p-4">{renderTemplate()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVPreview;
