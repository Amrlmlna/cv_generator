import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const ElegantTemplate = ({ showPlaceholders = true }) => {
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
      primary: "text-primary-700",
      secondary: "text-primary-500",
      border: "border-primary-200",
      bg: "bg-primary-50",
    },
    green: {
      primary: "text-emerald-700",
      secondary: "text-emerald-500",
      border: "border-emerald-200",
      bg: "bg-emerald-50",
    },
    purple: {
      primary: "text-violet-700",
      secondary: "text-violet-500",
      border: "border-violet-200",
      bg: "bg-violet-50",
    },
    gray: {
      primary: "text-gray-700",
      secondary: "text-gray-500",
      border: "border-gray-200",
      bg: "bg-gray-50",
    },
  };

  const colors = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="w-full h-full bg-white p-8 font-serif">
      {/* Elegant header with serif font */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900">
          {personalInfo.fullName}
        </h1>
        <p className={`text-xl mt-1 ${colors.secondary}`}>
          {personalInfo.title}
        </p>

        <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
          <div>{personalInfo.email}</div>
          <div>{personalInfo.phone}</div>
          <div>{personalInfo.location}</div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className={`text-lg font-bold ${colors.primary} mb-3 text-center`}>
          Profile
        </h2>
        <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          {personalInfo.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content - Experience and Education */}
        <div className="md:col-span-2 space-y-8">
          {/* Experience */}
          <div>
            <h2
              className={`text-lg font-bold ${colors.primary} mb-4 pb-2 border-b ${colors.border}`}
            >
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {exp.position}
                  </h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="italic">
                      {exp.company}, {exp.location}
                    </span>
                    <span className={`${colors.secondary}`}>
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2
              className={`text-lg font-bold ${colors.primary} mb-4 pb-2 border-b ${colors.border}`}
            >
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="italic">{edu.institution}</span>
                    <span className={`${colors.secondary}`}>
                      {edu.startDate} - {edu.endDate || "Present"}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Skills, Languages, Certificates */}
        <div className="space-y-8">
          {/* Skills */}
          <div>
            <h2
              className={`text-lg font-bold ${colors.primary} mb-4 pb-2 border-b ${colors.border}`}
            >
              Expertise
            </h2>
            <ul className="space-y-2">
              {skills.map((skill, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${colors.bg} border ${colors.border}`}
                  ></div>
                  <span className="text-gray-700">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h2
              className={`text-lg font-bold ${colors.primary} mb-4 pb-2 border-b ${colors.border}`}
            >
              Languages
            </h2>
            <ul className="space-y-3">
              {languages.map((lang, index) => (
                <li key={index} className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">
                      {lang.language}
                    </span>
                    <span className="italic text-sm text-gray-600">
                      {lang.proficiency}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div>
              <h2
                className={`text-lg font-bold ${colors.primary} mb-4 pb-2 border-b ${colors.border}`}
              >
                Certifications
              </h2>
              <ul className="space-y-3">
                {certificates.map((cert, index) => (
                  <li key={index}>
                    <div className="font-medium text-gray-800">{cert.name}</div>
                    <div className="text-sm text-gray-600">{cert.issuer}</div>
                    <div className="text-xs italic text-gray-500">
                      {cert.date}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElegantTemplate;
