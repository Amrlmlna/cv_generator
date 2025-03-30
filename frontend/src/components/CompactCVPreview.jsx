"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import ClassicTemplate from "./cv-templates/ClassicTemplate";
import ModernTemplate from "./cv-templates/ModernTemplate";
import MinimalTemplate from "./cv-templates/MinimalTemplate";

const CompactCVPreview = ({ formData, template }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level for fullscreen view

  const data = {
    personalInfo: {
      full_name: formData.personalInfo?.full_name || "John Doe",
      email: formData.personalInfo?.email || "johndoe@example.com",
      phone: formData.personalInfo?.phone || "+1 (555) 123-4567",
      address:
        formData.personalInfo?.address || "123 Main Street, New York, NY 10001",
      linkedin: formData.personalInfo?.linkedin || "johndoe",
      github: formData.personalInfo?.github || "johndoe",
      website: formData.personalInfo?.website || "www.johndoe.com",
      summary:
        formData.personalInfo?.summary ||
        "Experienced professional with a proven track record of success in the industry. Skilled in project management, team leadership, and strategic planning. Passionate about delivering high-quality results and driving innovation.",
    },
    education:
      formData.education?.length > 0
        ? formData.education
        : [
            {
              institution: "University of Example",
              degree: "Bachelor of Science",
              field_of_study: "Computer Science",
              start_date: "2016-09-01",
              end_date: "2020-06-30",
              gpa: "3.8",
              description:
                "Graduated with honors. Participated in various coding competitions and research projects.",
            },
          ],
    experience:
      formData.experience?.length > 0
        ? formData.experience
        : [
            {
              company: "Example Corporation",
              position: "Senior Developer",
              start_date: "2020-07-01",
              end_date: "",
              is_current: true,
              description:
                "Lead developer for multiple projects. Responsible for architecture design, code reviews, and mentoring junior developers.",
            },
            {
              company: "Tech Solutions Inc.",
              position: "Junior Developer",
              start_date: "2018-06-01",
              end_date: "2020-06-30",
              is_current: false,
              description:
                "Developed and maintained web applications. Collaborated with cross-functional teams to deliver high-quality software solutions.",
            },
          ],
    skills:
      formData.skills?.length > 0
        ? formData.skills
        : [
            { name: "JavaScript", proficiency: "expert" },
            { name: "React", proficiency: "advanced" },
            { name: "Node.js", proficiency: "intermediate" },
            { name: "Python", proficiency: "intermediate" },
            { name: "SQL", proficiency: "advanced" },
          ],
    projects:
      formData.projects?.length > 0
        ? formData.projects
        : [
            {
              name: "Portfolio Website",
              description:
                "Personal portfolio website built with React and Next.js. Features responsive design and dark mode.",
              start_date: "2022-01-01",
              end_date: "2022-03-31",
              url: "https://example.com/portfolio",
            },
            {
              name: "Task Management App",
              description:
                "A full-stack application for task management with user authentication and real-time updates.",
              start_date: "2021-06-01",
              end_date: "2021-12-31",
              url: "https://example.com/taskapp",
            },
          ],
  };

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "classic":
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  const zoomIn = () => {
    if (zoomLevel < 1.5) setZoomLevel(zoomLevel + 0.1);
  };

  const zoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel(zoomLevel - 0.1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="sticky top-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold text-lg">Preview</h3>
        <div className="flex space-x-2">
          <button
            className="px-2 py-1 border rounded hover:bg-gray-100"
            onClick={toggleFullscreen}
            title="Fullscreen preview"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Compact preview - fixed aspect ratio thumbnail */}
      <div
        className="p-4 bg-gray-100 rounded-b-lg cursor-pointer flex justify-center"
        onClick={toggleFullscreen}
      >
        {/* A4 paper has a 1:√2 aspect ratio (approximately 1:1.414) */}
        <div
          className="relative w-full max-w-[250px] shadow-md"
          style={{ aspectRatio: "1/1.414" }}
        >
          <div className="absolute inset-0 bg-white overflow-hidden">
            {/* Scale down the content to fit in the thumbnail */}
            <div className="transform scale-[0.25] origin-top-left w-[400%] h-[400%]">
              {renderTemplate()}
            </div>
          </div>

          {/* Overlay hint to click for full view */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="bg-gray-800 bg-opacity-70 text-white px-2 py-0.5 rounded-full text-xs">
              Click to view full size
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen preview dialog */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold text-lg">CV Preview</h3>
              <div className="flex space-x-2">
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={zoomOut}
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 1.5}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              <div
                className="bg-white shadow-md mx-auto"
                style={{
                  width: `${Math.min(800 * zoomLevel, 100)}%`,
                  maxWidth: "800px",
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "top center",
                  aspectRatio: "1/1.414", // A4 paper aspect ratio
                }}
              >
                {renderTemplate()}
              </div>
            </div>
            <div className="p-3 border-t">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={toggleFullscreen}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CompactCVPreview.propTypes = {
  formData: PropTypes.object.isRequired,
  template: PropTypes.string.isRequired,
};

export default CompactCVPreview;
