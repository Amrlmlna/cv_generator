"use client";

import { useEffect } from "react";
import ProfessionalTemplate from "./cv-templates/ProfessionalTemplate";
import ModernTemplate from "./cv-templates/ModernTemplate";

const PrintableCV = ({ cvData, onAfterPrint }) => {
  useEffect(() => {
    // Add print-specific styles
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-cv, #printable-cv * {
          visibility: visible;
        }
        #printable-cv {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    // Handle after print
    const handleAfterPrint = () => {
      if (onAfterPrint) onAfterPrint();
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [onAfterPrint]);

  const renderTemplate = () => {
    switch (cvData.templateId) {
      case "professional":
        return <ProfessionalTemplate data={cvData} />;
      case "modern":
        return <ModernTemplate data={cvData} />;
      case "minimalist":
        // Default to professional if minimalist not implemented yet
        return <ProfessionalTemplate data={cvData} />;
      default:
        return <ProfessionalTemplate data={cvData} />;
    }
  };

  return (
    <div id="printable-cv" className="print:block hidden">
      {renderTemplate()}
    </div>
  );
};

export default PrintableCV;
