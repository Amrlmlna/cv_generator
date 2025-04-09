import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const CompactTemplate = ({ showPlaceholders = true }) => {
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
    blue: "text-primary-600 border-primary-600 bg-primary-50",
    green: "text-emerald-600 border-emerald-600 bg-emerald-50",
    purple: "text-violet-600 border-violet-600 bg-violet-50",
    gray: "text-gray-700 border-gray-700 bg-gray-50",
  };

  const colors = colorClasses[colorScheme].split(" ");
  const textColor = colors[0];
  const borderColor = colors[1];
  const bgColor = colors[2];

  return (
    <div className="w-full h-full bg-white p-6 text-sm">
      {/* Compact header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {personalInfo.fullName}
          </h1>
          <p className={`text-base ${textColor} font-medium`}>
            {personalInfo.title}
          </p>
        </div>
        <div className="mt-2 md:mt-0 text-right text-gray-700">
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
          <p>{personalInfo.location}</p>
        </div>
      </div>

      {/* Summary - Compact */}
      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-snug">
          {personalInfo.summary}
        </p>
      </div>

      {/* Skills - Compact horizontal list */}
      <div className="mb-4">
        <h2 className={`text-base font-bold ${textColor} mb-2`}>Skills</h2>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`${bgColor} ${textColor} px-2 py-0.5 text-xs rounded`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience - Compact */}
      <div className="mb-4">
        <h2 className={`text-base font-bold ${textColor} mb-2`}>
          Professional Experience
        </h2>
        <div className="space-y-3">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="pb-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                <span className="text-xs text-gray-500">
                  {exp.startDate} - {exp.endDate || "Present"}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                {exp.company}, {exp.location}
              </p>
              <p className="text-xs text-gray-700 leading-snug">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two column layout for education, languages and certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Education - Compact */}
        <div>
          <h2 className={`text-base font-bold ${textColor} mb-2`}>Education</h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div
                key={index}
                className="pb-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-800">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{edu.institution}</p>
                {edu.description && (
                  <p className="text-xs text-gray-700 leading-snug">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Languages - Compact */}
          <div>
            <h2 className={`text-base font-bold ${textColor} mb-2`}>
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {languages.map((lang, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    {lang.language}
                  </span>
                  <span className="text-xs text-gray-500">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates - Compact */}
          {certificates.length > 0 && (
            <div>
              <h2 className={`text-base font-bold ${textColor} mb-2`}>
                Certifications
              </h2>
              <div className="space-y-1">
                {certificates.map((cert, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      {cert.name}
                    </span>
                    <span className="text-xs text-gray-500">{cert.date}</span>
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

export default CompactTemplate;
