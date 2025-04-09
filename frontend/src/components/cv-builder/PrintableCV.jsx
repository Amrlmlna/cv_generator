"use client";

import { useEffect } from "react";
import ProfessionalTemplate from "./cv-templates/ProfessionalTemplate";
import ModernTemplate from "./cv-templates/ModernTemplate";
import MinimalistTemplate from "./cv-templates/MinimalistTemplate";
import AcademicTemplate from "./cv-templates/AcademicTemplate";
import ChronologicalTemplate from "./cv-templates/ChronologicalTemplate";
import CompactTemplate from "./cv-templates/CompactTemplate";
import CreativeTemplate from "./cv-templates/CreativeTemplate";
import ElegantTemplate from "./cv-templates/ElegantTemplate";
import ExecutiveTemplate from "./cv-templates/ExecutiveTemplate";
import FunctionalTemplate from "./cv-templates/FunctionalTemplate";
import InfographicTemplate from "./cv-templates/InfographicTemplate";
import TechnicalTemplate from "./cv-templates/TechnicalTemplate";

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
        return <MinimalistTemplate data={cvData} />;
      case "academic":
        return <AcademicTemplate data={cvData} />;
      case "chronological":
        return <ChronologicalTemplate data={cvData} />;
      case "compact":
        return <CompactTemplate data={cvData} />;
      case "creative":
        return <CreativeTemplate data={cvData} />;
      case "elegant":
        return <ElegantTemplate data={cvData} />;
      case "executive":
        return <ExecutiveTemplate data={cvData} />;
      case "functional":
        return <FunctionalTemplate data={cvData} />;
      case "infographic":
        return <InfographicTemplate data={cvData} />;
      case "technical":
        return <TechnicalTemplate data={cvData} />;
      default:
        return <ProfessionalTemplate showPlaceholders={showPlaceholders} />;
    }
  };

  return (
    <div id="printable-cv" className="print:block hidden">
      {renderTemplate()}
    </div>
  );
};

export default PrintableCV;
