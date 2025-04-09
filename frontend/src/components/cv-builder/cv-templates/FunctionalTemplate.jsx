import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const FunctionalTemplate = ({ showPlaceholders = true }) => {
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

  // Group skills by category for functional resume
  const skillGroups = [
    {
      name: "Core Competencies",
      skills: skills.slice(0, Math.ceil(skills.length / 3)),
    },
    {
      name: "Technical Skills",
      skills: skills.slice(
        Math.ceil(skills.length / 3),
        Math.ceil(skills.length / 3) * 2
      ),
    },
    {
      name: "Soft Skills",
      skills: skills.slice(Math.ceil(skills.length / 3) * 2),
    },
  ];

  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b-4 border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.fullName}
        </h1>
        <p className={`text-xl mt-1 ${colors.text}`}>{personalInfo.title}</p>

        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          <div>{personalInfo.email}</div>
          <div>{personalInfo.phone}</div>
          <div>{personalInfo.location}</div>
        </div>
      </div>

      <div className="p-6">
        {/* Professional Summary */}
        <div className="mb-8">
          <h2
            className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}
          >
            Professional Summary
          </h2>
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>

        {/* Skills - Featured prominently in functional resume */}
        <div className="mb-8">
          <h2
            className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}
          >
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="font-bold text-gray-800 mb-2">{group.name}</h3>
                <ul className="space-y-2">
                  {group.skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${colors.primary}`}
                      ></div>
                      <span className="text-gray-700">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Experience - Condensed in functional resume */}
        <div className="mb-8">
          <h2
            className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}
          >
            Professional Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-800">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  {exp.company}, {exp.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <h2
              className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-bold text-gray-800">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Languages */}
            <div>
              <h2
                className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}
              >
                Languages
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium text-gray-800">
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
                <h2
                  className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}
                >
                  Certifications
                </h2>
                <div className="space-y-2">
                  {certificates.map((cert, index) => (
                    <div key={index}>
                      <div className="font-medium text-gray-800">
                        {cert.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {cert.issuer} • {cert.date}
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

export default FunctionalTemplate;
