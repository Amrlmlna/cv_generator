"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ClassicTemplate from "./cv-templates/ClassicTemplate";
import ModernTemplate from "./cv-templates/ModernTemplate";
import MinimalTemplate from "./cv-templates/MinimalTemplate";

const CVPreview = ({ formData, template }) => {
  const [data, setData] = useState({
    personalInfo: {},
    education: [],
    experience: [],
    skills: [],
    projects: [],
  });

  useEffect(() => {
    // Transform form data into the format expected by templates
    const transformedData = {
      personalInfo: formData.personalInfo || {},
      education: formData.education || [],
      experience: formData.experience || [],
      skills: formData.skills || [],
      projects: formData.projects || [],
    };

    setData(transformedData);
  }, [formData]);

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

  return (
    <div className="h-full overflow-hidden bg-gray-100 rounded-lg shadow-inner">
      <div className="h-full overflow-y-auto p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden transform scale-90 origin-top">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

CVPreview.propTypes = {
  formData: PropTypes.object.isRequired,
  template: PropTypes.string.isRequired,
};

export default CVPreview;
