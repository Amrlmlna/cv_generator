import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const AcademicTemplate = ({ showPlaceholders = true }) => {
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
      primary: "text-primary-800",
      border: "border-primary-800",
      bg: "bg-primary-50",
    },
    green: {
      primary: "text-emerald-800",
      border: "border-emerald-800",
      bg: "bg-emerald-50",
    },
    purple: {
      primary: "text-violet-800",
      border: "border-violet-800",
      bg: "bg-violet-50",
    },
    gray: {
      primary: "text-gray-800",
      border: "border-gray-800",
      bg: "bg-gray-50",
    },
  };

  const colors = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="w-full h-full bg-white p-8 font-serif">
      {/* Academic header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.fullName}
        </h1>
        <p className="text-xl mt-1 text-gray-700">{personalInfo.title}</p>

        <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600">
          <div>{personalInfo.email}</div>
          <div>{personalInfo.phone}</div>
          <div>{personalInfo.location}</div>
        </div>
      </div>

      <div className="border-t border-b border-gray-300 py-4 mb-6">
        <p className="text-gray-700 leading-relaxed text-center">
          {personalInfo.summary}
        </p>
      </div>

      {/* Education - Featured prominently for academic CV */}
      <div className="mb-8">
        <h2
          className={`text-xl font-bold ${colors.primary} mb-4 pb-1 border-b ${colors.border}`}
        >
          Education
        </h2>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold text-gray-800">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <span className="text-gray-600">
                  {edu.startDate} - {edu.endDate || "Present"}
                </span>
              </div>
              <p className="text-base font-medium text-gray-700 mb-1">
                {edu.institution}
              </p>
              {edu.description && (
                <p className="text-gray-700">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Research Experience / Work Experience */}
      <div className="mb-8">
        <h2
          className={`text-xl font-bold ${colors.primary} mb-4 pb-1 border-b ${colors.border}`}
        >
          Research & Professional Experience
        </h2>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold text-gray-800">
                  {exp.position}
                </h3>
                <span className="text-gray-600">
                  {exp.startDate} - {exp.endDate || "Present"}
                </span>
              </div>
              <p className="text-base font-medium text-gray-700 mb-1">
                {exp.company}, {exp.location}
              </p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills - Academic focus */}
        <div>
          <h2
            className={`text-xl font-bold ${colors.primary} mb-4 pb-1 border-b ${colors.border}`}
          >
            Areas of Expertise
          </h2>
          <ul className="list-disc list-inside space-y-1 pl-4">
            {skills.map((skill, index) => (
              <li key={index} className="text-gray-700">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {/* Languages */}
          <div>
            <h2
              className={`text-xl font-bold ${colors.primary} mb-4 pb-1 border-b ${colors.border}`}
            >
              Languages
            </h2>
            <ul className="space-y-2">
              {languages.map((lang, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-medium text-gray-800">
                    {lang.language}
                  </span>
                  <span className="text-gray-600">{lang.proficiency}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificates / Publications */}
          {certificates.length > 0 && (
            <div>
              <h2
                className={`text-xl font-bold ${colors.primary} mb-4 pb-1 border-b ${colors.border}`}
              >
                Publications & Certifications
              </h2>
              <ul className="space-y-3">
                {certificates.map((cert, index) => (
                  <li key={index} className="text-gray-700">
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-sm text-gray-600">
                      {cert.issuer}, {cert.date}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer with page number styling */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>{personalInfo.fullName} • Curriculum Vitae • Page 1</p>
      </div>
    </div>
  );
};

export default AcademicTemplate;
