import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const ModernTemplate = ({ showPlaceholders = true }) => {
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
    blue: "text-primary-600 border-primary-600",
    green: "text-emerald-600 border-emerald-600",
    purple: "text-violet-600 border-violet-600",
    gray: "text-gray-700 border-gray-700",
  };

  const accentColor = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="w-full h-full bg-white shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold ${accentColor.split(" ")[0]}`}>
          {personalInfo.fullName}
        </h1>
        <p className="text-xl mt-1 text-gray-600">{personalInfo.title}</p>

        <div className="flex justify-center gap-4 mt-3 text-sm text-gray-600">
          <div>{personalInfo.email}</div>
          <div>{personalInfo.phone}</div>
          <div>{personalInfo.location}</div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2
          className={`text-lg font-semibold mb-3 pb-1 border-b ${
            accentColor.split(" ")[1]
          }`}
        >
          About Me
        </h2>
        <p className="text-sm">{personalInfo.summary}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          <div>
            <h2
              className={`text-lg font-semibold mb-3 pb-1 border-b ${
                accentColor.split(" ")[1]
              }`}
            >
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-3 before:w-3 before:rounded-full before:border-2 before:border-current before:content-[''] before:bg-white"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{exp.position}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {exp.company}, {exp.location}
                  </div>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2
              className={`text-lg font-semibold mb-3 pb-1 border-b ${
                accentColor.split(" ")[1]
              }`}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-3 before:w-3 before:rounded-full before:border-2 before:border-current before:content-[''] before:bg-white"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{edu.institution}</div>
                  {edu.description && (
                    <p className="text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="col-span-1 space-y-6">
          {/* Skills */}
          <div>
            <h2
              className={`text-lg font-semibold mb-3 pb-1 border-b ${
                accentColor.split(" ")[1]
              }`}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full border ${accentColor}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2
              className={`text-lg font-semibold mb-3 pb-1 border-b ${
                accentColor.split(" ")[1]
              }`}
            >
              Languages
            </h2>
            <ul className="space-y-2">
              {languages.map((lang, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{lang.language}</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${accentColor
                        .split(" ")[0]
                        .replace("text", "bg")}`}
                      style={{
                        width:
                          lang.proficiency === "Native"
                            ? "100%"
                            : lang.proficiency === "Fluent"
                            ? "90%"
                            : lang.proficiency === "Advanced"
                            ? "75%"
                            : lang.proficiency === "Intermediate"
                            ? "50%"
                            : lang.proficiency === "Elementary"
                            ? "30%"
                            : "15%",
                      }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div>
              <h2
                className={`text-lg font-semibold mb-3 pb-1 border-b ${
                  accentColor.split(" ")[1]
                }`}
              >
                Certifications
              </h2>
              <ul className="space-y-2 text-sm">
                {certificates.map((cert, index) => (
                  <li key={index}>
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-gray-700">{cert.issuer}</div>
                    <div className="text-xs text-gray-600">{cert.date}</div>
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

export default ModernTemplate;
