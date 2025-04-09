import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const InfographicTemplate = ({ showPlaceholders = true }) => {
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
      primary: "bg-primary-600",
      secondary: "bg-primary-200",
      text: "text-primary-600",
      border: "border-primary-600",
      light: "bg-primary-50",
    },
    green: {
      primary: "bg-emerald-600",
      secondary: "bg-emerald-200",
      text: "text-emerald-600",
      border: "border-emerald-600",
      light: "bg-emerald-50",
    },
    purple: {
      primary: "bg-violet-600",
      secondary: "bg-violet-200",
      text: "text-violet-600",
      border: "border-violet-600",
      light: "bg-violet-50",
    },
    gray: {
      primary: "bg-gray-700",
      secondary: "bg-gray-200",
      text: "text-gray-700",
      border: "border-gray-700",
      light: "bg-gray-50",
    },
  };

  const colors = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="w-full h-full bg-white">
      {/* Visual header with graphic elements */}
      <div
        className={`${colors.primary} text-white p-6 relative overflow-hidden`}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white opacity-10 -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold">{personalInfo.fullName}</h1>
          <p className="text-xl mt-1">{personalInfo.title}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-800">
                @
              </div>
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-800">
                ☎
              </div>
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-800">
                📍
              </div>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* About me with visual element */}
        <div className="mb-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div
              className={`w-40 h-40 rounded-full ${colors.secondary} flex items-center justify-center`}
            >
              <div
                className={`w-32 h-32 rounded-full ${colors.primary} text-white flex items-center justify-center text-lg font-bold`}
              >
                About Me
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <p className="text-gray-700">{personalInfo.summary}</p>
          </div>
        </div>

        {/* Skills with visual bars */}
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${colors.text} mb-4`}>Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">{skill}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${colors.primary}`}
                    style={{ width: `${100 - ((index * 5) % 30)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience with timeline visualization */}
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
            Experience
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div
              className={`absolute left-4 top-0 bottom-0 w-1 ${colors.secondary}`}
            ></div>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-12">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-1.5 w-9 h-9 rounded-full ${colors.primary} flex items-center justify-center text-white font-bold`}
                  >
                    {index + 1}
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${colors.border} ${colors.light}`}
                  >
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-lg font-bold text-gray-800">
                        {exp.position}
                      </h3>
                      <span className="text-sm font-medium text-gray-600">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {exp.company}, {exp.location}
                    </p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education with visual elements */}
          <div>
            <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-full ${colors.primary} text-white flex items-center justify-center font-bold`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    </div>
                  </div>
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

          <div className="space-y-6">
            {/* Languages with visual representation */}
            <div>
              <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
                Languages
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <div
                        className={`w-16 h-16 rounded-full ${colors.secondary} flex items-center justify-center`}
                      >
                        <div
                          className={`absolute inset-0 rounded-full ${colors.primary}`}
                          style={{
                            clipPath: `polygon(50% 50%, 50% 0%, ${
                              lang.proficiency === "Native"
                                ? "100% 0%, 100% 100%, 0% 100%, 0% 0%"
                                : lang.proficiency === "Fluent"
                                ? "100% 0%, 100% 75%, 0% 75%, 0% 0%"
                                : lang.proficiency === "Advanced"
                                ? "100% 0%, 100% 50%, 0% 50%, 0% 0%"
                                : lang.proficiency === "Intermediate"
                                ? "100% 0%, 50% 0%, 50% 50%"
                                : "75% 0%, 50% 0%"
                            })`,
                          }}
                        ></div>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center z-10">
                          <span className="font-bold text-sm text-gray-800">
                            {lang.language.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {lang.language}
                    </span>
                    <span className="text-xs text-gray-600">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates with visual elements */}
            {certificates.length > 0 && (
              <div>
                <h2 className={`text-xl font-bold ${colors.text} mb-4`}>
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certificates.map((cert, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${colors.light} border ${colors.border} flex items-center gap-3`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${colors.primary} text-white flex items-center justify-center font-bold text-xs`}
                      >
                        CERT
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {cert.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {cert.issuer} • {cert.date}
                        </div>
                      </div>
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

export default InfographicTemplate;
