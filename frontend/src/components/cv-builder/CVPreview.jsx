"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { toast } from "react-hot-toast";
import useCV from "../../store/cvStore";
import ProfessionalTemplate from "./cv-templates/ProfessionalTemplate";
import ModernTemplate from "./cv-templates/ModernTemplate";
import { uploadCV } from "../../services/cvService";

const CVPreview = () => {
  const { templateId, personalInfo } = useCV();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cvTitle, setCvTitle] = useState("");
  const [showTitleInput, setShowTitleInput] = useState(false);
  const cvRef = useRef(null);

  const renderTemplate = () => {
    switch (templateId) {
      case "professional":
        return <ProfessionalTemplate />;
      case "modern":
        return <ModernTemplate />;
      case "minimalist":
        // Default to professional if minimalist not implemented yet
        return <ProfessionalTemplate />;
      default:
        return <ProfessionalTemplate />;
    }
  };

  const handleDownload = async () => {
    if (!cvRef.current) return;

    setIsCapturing(true);

    try {
      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${personalInfo.fullName || "my-cv"}.png`;
      link.href = imageData;
      link.click();
      toast.success("CV downloaded successfully!");
    } catch (error) {
      console.error("Error generating CV image:", error);
      toast.error("Failed to download CV. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSaveToBackend = async () => {
    if (!cvRef.current) return;

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
      // Capture CV as image
      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Convert canvas to blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      // Create form data
      const formData = new FormData();
      formData.append("image", blob, `${personalInfo.fullName || "cv"}.png`);
      formData.append("title", cvTitle);

      // Upload to backend
      const response = await uploadCV(formData);

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
            onClick={handleDownload}
            disabled={isCapturing || isSaving}
            className="btn btn-outline text-sm flex items-center gap-1"
          >
            {isCapturing ? "Processing..." : "Download Preview"}
          </button>
          <button
            onClick={handleSaveToBackend}
            disabled={isCapturing || isSaving}
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
          <div className="flex gap-2">
            <input
              id="cvTitle"
              type="text"
              className="input flex-1"
              value={cvTitle}
              onChange={(e) => setCvTitle(e.target.value)}
              placeholder="Enter a title for your CV"
            />
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

      <div className="border border-secondary-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-auto max-h-[800px]" ref={cvRef}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
