import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const TechnicalTemplate = ({ showPlaceholders = true }) => {
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
      text: "text-primary-600",
      border: "border-primary-600",
      light: "bg-primary-100",
    },
    green: {
      primary: "bg-emerald-600",
      text: "text-emerald-600",
      border: "border-emerald-600",
      light: "bg-emerald-100",
    },
    purple: {
      primary: "bg-violet-600",
      text: "text-violet-600",
      border: "border-violet-600",
      light: "bg-violet-100",
    },
    gray: {
      primary: "bg-gray-700",
      text: "text-gray-700",
      border: "border-gray-700",
      light: "bg-gray-100",
    },
  };

  const colors = colorClasses[colorScheme] || colorClasses.blue;

  // Group skills by category (for technical template)
  const skillCategories = {
    "Programming Languages": skills.slice(0, Math.ceil(skills.length / 3)),
    "Frameworks & Tools": skills.slice(
      Math.ceil(skills.length / 3),
      Math.ceil(skills.length / 3) * 2
    ),
    "Other Skills": skills.slice(Math.ceil(skills.length / 3) * 2),
  };

  return (
    <div className="w-full h-full bg-white font-mono">
      {/* Technical header with monospace font and code-like styling */}
      <div className={`${colors.primary} text-white p-6`}>
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold">{personalInfo.fullName}</h1>
            <p className="text-lg opacity-90">{personalInfo.title}</p>
          </div>
          <div className="mt-4 md:mt-0 md:text-right">
            <p className="opacity-90">{personalInfo.email}</p>
            <p className="opacity-90">{personalInfo.phone}</p>
            <p className="opacity-90">{personalInfo.location}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Technical Summary */}
        <div className="mb-6 p-4 border border-gray-200 rounded bg-gray-50">
          <h2 className={`text-lg font-bold ${colors.text} mb-2`}>
            // PROFILE
          </h2>
          <p className="text-gray-800 font-mono">{personalInfo.summary}</p>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
          <h2 className={`text-lg font-bold ${colors.text} mb-3`}>
            // TECHNICAL SKILLS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(skillCategories).map(
              ([category, categorySkills]) => (
                <div
                  key={category}
                  className="p-3 border border-gray-200 rounded"
                >
                  <h3 className="font-bold text-gray-700 mb-2 text-sm border-b pb-1">
                    {category}
                  </h3>
                  <ul className="space-y-1">
                    {categorySkills.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 ${colors.primary} rounded-full`}
                        ></span>
                        <span className="text-sm">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <h2 className={`text-lg font-bold ${colors.text} mb-3`}>
            // WORK EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                  <h3 className="font-bold text-gray-800">{exp.position}</h3>
                  <div className="text-sm text-gray-600">
                    <span className="font-mono">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div>
            <h2 className={`text-lg font-bold ${colors.text} mb-3`}>
              // EDUCATION
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded">
                  <h3 className="font-bold text-gray-800">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-mono">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </span>
                  </p>
                  {edu.description && (
                    <p className="text-sm text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Languages */}
            <div>
              <h2 className={`text-lg font-bold ${colors.text} mb-3`}>
                // LANGUAGES
              </h2>
              <div className="p-3 border border-gray-200 rounded">
                <ul className="space-y-2">
                  {languages.map((lang, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium">{lang.language}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const proficiencyLevel =
                            lang.proficiency === "Native"
                              ? 5
                              : lang.proficiency === "Fluent"
                              ? 4
                              : lang.proficiency === "Advanced"
                              ? 3
                              : lang.proficiency === "Intermediate"
                              ? 2
                              : 1;

                          return (
                            <div
                              key={level}
                              className={`w-3 h-3 rounded-sm ${
                                level <= proficiencyLevel
                                  ? colors.primary
                                  : "bg-gray-200"
                              }`}
                            ></div>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Certificates */}
            {certificates.length > 0 && (
              <div>
                <h2 className={`text-lg font-bold ${colors.text} mb-3`}>
                  // CERTIFICATIONS
                </h2>
                <div className="p-3 border border-gray-200 rounded">
                  <ul className="space-y-3">
                    {certificates.map((cert, index) => (
                      <li key={index}>
                        <div className="font-bold text-gray-800">
                          {cert.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {cert.issuer} | {cert.date}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate;
