import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const MinimalistTemplate = ({ showPlaceholders = true }) => {
  const cvData = useCV();

  // Get data with placeholders if needed
  const personalInfo = getDisplayData(cvData, "personalInfo", showPlaceholders);
  const education = getDisplayData(cvData, "education", showPlaceholders);
  const experience = getDisplayData(cvData, "experience", showPlaceholders);
  const skills = getDisplayData(cvData, "skills", showPlaceholders);
  const languages = getDisplayData(cvData, "languages", showPlaceholders);
  const certificates = getDisplayData(cvData, "certificates", showPlaceholders);
  const colorScheme = cvData.colorScheme || "blue";

  // Map color scheme to actual color classes
  const colorClasses = {
    blue: "text-primary-600",
    green: "text-emerald-600",
    purple: "text-violet-600",
    gray: "text-gray-700",
  };

  const accentColor = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="w-full h-full bg-white p-8">
      {/* Header - Minimalist with just name and title */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className={`text-3xl font-light ${accentColor}`}>
          {personalInfo.fullName}
        </h1>
        <p className="text-lg text-gray-600 mt-1">{personalInfo.title}</p>
      </div>

      {/* Two column layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main content column */}
        <div className="flex-1 space-y-6">
          {/* Summary */}
          <div className="mb-6">
            <h2 className={`text-lg font-light mb-3 ${accentColor}`}>
              Profile
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>

          {/* Experience */}
          <div>
            <h2 className={`text-lg font-light mb-3 ${accentColor}`}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-800">
                      {exp.position}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {exp.company}, {exp.location}
                  </p>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className={`text-lg font-light mb-3 ${accentColor}`}>
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-800">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {edu.institution}
                  </p>
                  {edu.description && (
                    <p className="text-sm text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Contact Information */}
          <div>
            <h2 className={`text-lg font-light mb-3 ${accentColor}`}>
              Contact
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.location}</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className={`text-lg font-light mb-3 ${accentColor}`}>Skills</h2>
            <div className="flex flex-wrap gap-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="w-full">
                  <p className="text-sm text-gray-700">{skill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className={`text-lg font-light mb-3 ${accentColor}`}>
              Languages
            </h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{lang.language}</span>
                  <span className="text-xs text-gray-500">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div>
              <h2 className={`text-lg font-light mb-3 ${accentColor}`}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certificates.map((cert, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      {cert.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {cert.issuer} • {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalistTemplate;
