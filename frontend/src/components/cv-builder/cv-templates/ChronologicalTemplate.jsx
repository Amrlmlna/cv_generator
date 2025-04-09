import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const ChronologicalTemplate = ({ showPlaceholders = true }) => {
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

  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className={`${colors.primary} text-white p-6`}>
        <h1 className="text-3xl font-bold">{personalInfo.fullName}</h1>
        <p className="text-xl mt-1">{personalInfo.title}</p>

        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <div>{personalInfo.email}</div>
          <div>{personalInfo.phone}</div>
          <div>{personalInfo.location}</div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="mb-6">
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>

        {/* Timeline-based layout */}
        <div className="relative border-l-2 pl-6 ml-4 mb-8 pb-8 border-gray-300">
          {/* Timeline header */}
          <div className="absolute -left-4 -top-6">
            <div
              className={`${colors.primary} text-white text-sm font-bold py-1 px-3 rounded`}
            >
              TIMELINE
            </div>
          </div>

          {/* Combine experience and education in chronological order */}
          {[
            ...experience.map((item) => ({ ...item, type: "experience" })),
            ...education.map((item) => ({ ...item, type: "education" })),
          ]
            .sort((a, b) => {
              // Sort by end date (or present) first, then start date
              const aEnd = a.endDate || "9999";
              const bEnd = b.endDate || "9999";
              if (aEnd !== bEnd) return bEnd.localeCompare(aEnd);
              return b.startDate.localeCompare(a.startDate);
            })
            .map((item, index) => (
              <div key={index} className="mb-8 relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-10 top-1.5 w-4 h-4 rounded-full ${colors.primary} border-4 border-white`}
                ></div>

                {/* Date flag */}
                <div className="absolute -left-36 top-0 w-24 text-right">
                  <span className="text-sm font-bold text-gray-600">
                    {item.startDate} - {item.endDate || "Present"}
                  </span>
                </div>

                {/* Content */}
                <div
                  className={`p-4 border border-gray-200 rounded-lg ${colors.light}`}
                >
                  {item.type === "experience" ? (
                    <>
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.position}
                      </h3>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {item.company}, {item.location}
                      </p>
                      <p className="text-gray-700">{item.description}</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.degree} {item.field && `in ${item.field}`}
                      </h3>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {item.institution}
                      </p>
                      {item.description && (
                        <p className="text-gray-700">{item.description}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Skills and other sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skills */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h2 className={`text-lg font-bold ${colors.text} mb-3`}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className={`${colors.light} px-3 py-1 rounded-full text-sm`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h2 className={`text-lg font-bold ${colors.text} mb-3`}>
              Languages
            </h2>
            <ul className="space-y-2">
              {languages.map((lang, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-gray-600">{lang.proficiency}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <h2 className={`text-lg font-bold ${colors.text} mb-3`}>
                Certifications
              </h2>
              <ul className="space-y-3">
                {certificates.map((cert, index) => (
                  <li key={index}>
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-sm text-gray-600">
                      {cert.issuer} • {cert.date}
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

export default ChronologicalTemplate;
