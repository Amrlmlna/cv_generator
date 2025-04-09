import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const ExecutiveTemplate = ({ showPlaceholders = true }) => {
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
    blue: {
      primary: "bg-primary-800",
      text: "text-primary-800",
      border: "border-primary-800",
    },
    green: {
      primary: "bg-emerald-800",
      text: "text-emerald-800",
      border: "border-emerald-800",
    },
    purple: {
      primary: "bg-violet-800",
      text: "text-violet-800",
      border: "border-violet-800",
    },
    gray: {
      primary: "bg-gray-800",
      text: "text-gray-800",
      border: "border-gray-800",
    },
  };

  const colors = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="w-full h-full bg-white">
      {/* Header with name and title */}
      <div className="p-8 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {personalInfo.fullName}
        </h1>
        <p className={`text-xl mt-1 ${colors.text} font-semibold`}>
          {personalInfo.title}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-gray-600">
          <div>{personalInfo.email}</div>
          <div>{personalInfo.phone}</div>
          <div>{personalInfo.location}</div>
        </div>

        <div className={`w-24 h-1 mt-6 mb-8 ${colors.primary}`}></div>
      </div>

      <div className="px-8">
        {/* Executive Summary */}
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${colors.text} mb-3`}>
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>

        {/* Professional Experience */}
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="pb-6 border-b border-gray-200 last:border-0"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {exp.position}
                  </h3>
                  <span className="text-sm font-medium text-gray-600">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                <p className="text-base font-medium text-gray-700 mb-2">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="pb-4 border-b border-gray-200 last:border-0"
                >
                  <h3 className="text-base font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-sm font-medium text-gray-700">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                  {edu.description && (
                    <p className="text-sm text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Skills */}
            <div>
              <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
                Core Competencies
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${colors.primary}`}
                    ></div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      {lang.language}
                    </span>
                    <span className="text-gray-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            {certificates.length > 0 && (
              <div>
                <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certificates.map((cert, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800">{cert.name}</h3>
                      <p className="text-sm text-gray-600">
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
    </div>
  );
};

export default ExecutiveTemplate;
