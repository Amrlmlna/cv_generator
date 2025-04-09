import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const CreativeTemplate = ({ showPlaceholders = true }) => {
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
      light: "bg-primary-100",
      border: "border-primary-600",
    },
    green: {
      primary: "bg-emerald-600",
      text: "text-emerald-600",
      light: "bg-emerald-100",
      border: "border-emerald-600",
    },
    purple: {
      primary: "bg-violet-600",
      text: "text-violet-600",
      light: "bg-violet-100",
      border: "border-violet-600",
    },
    gray: {
      primary: "bg-gray-700",
      text: "text-gray-700",
      light: "bg-gray-100",
      border: "border-gray-700",
    },
  };

  const colors = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="w-full h-full bg-white">
      {/* Creative header with diagonal design */}
      <div className={`relative ${colors.primary} text-white p-8 pb-16`}>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">{personalInfo.fullName}</h1>
          <p className="text-xl mt-2 opacity-90">{personalInfo.title}</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white"></div>
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white"></div>
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white"></div>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        </div>

        {/* Diagonal cut */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        ></div>
      </div>

      <div className="p-8 pt-0">
        {/* About section */}
        <div className="mb-8 mt-4">
          <h2
            className={`inline-block text-xl font-bold ${colors.text} pb-1 mb-3 border-b-2 ${colors.border}`}
          >
            About Me
          </h2>
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content - Experience and Education */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience */}
            <div>
              <h2
                className={`inline-block text-xl font-bold ${colors.text} pb-1 mb-4 border-b-2 ${colors.border}`}
              >
                Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-6">
                    <div
                      className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${colors.primary}`}
                    ></div>
                    <h3 className="text-lg font-semibold">{exp.position}</h3>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>
                        {exp.company}, {exp.location}
                      </span>
                      <span>
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
                className={`inline-block text-xl font-bold ${colors.text} pb-1 mb-4 border-b-2 ${colors.border}`}
              >
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="relative pl-6">
                    <div
                      className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${colors.primary}`}
                    ></div>
                    <h3 className="text-lg font-semibold">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{edu.institution}</span>
                      <span>
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
                className={`inline-block text-xl font-bold ${colors.text} pb-1 mb-4 border-b-2 ${colors.border}`}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`${colors.light} ${colors.text} px-3 py-1 rounded-full text-sm`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h2
                className={`inline-block text-xl font-bold ${colors.text} pb-1 mb-4 border-b-2 ${colors.border}`}
              >
                Languages
              </h2>
              <div className="space-y-3">
                {languages.map((lang, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{lang.language}</span>
                      <span className="text-sm text-gray-600">
                        {lang.proficiency}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${colors.primary}`}
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
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            {certificates.length > 0 && (
              <div>
                <h2
                  className={`inline-block text-xl font-bold ${colors.text} pb-1 mb-4 border-b-2 ${colors.border}`}
                >
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certificates.map((cert, index) => (
                    <div key={index} className={`p-3 rounded ${colors.light}`}>
                      <h3 className="font-medium">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">{cert.date}</p>
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

export default CreativeTemplate;
