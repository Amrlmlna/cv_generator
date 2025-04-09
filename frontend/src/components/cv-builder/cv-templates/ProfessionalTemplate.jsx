import useCV from "../../../store/cvStore"

const ProfessionalTemplate = () => {
  const { personalInfo, education, experience, skills, languages, certificates, colorScheme } = useCV()

  // Color scheme classes
  const colorClasses = {
    blue: {
      primary: "bg-primary-600",
      text: "text-primary-700",
      light: "bg-primary-50",
      border: "border-primary-200",
    },
    green: {
      primary: "bg-emerald-600",
      text: "text-emerald-700",
      light: "bg-emerald-50",
      border: "border-emerald-200",
    },
    purple: {
      primary: "bg-violet-600",
      text: "text-violet-700",
      light: "bg-violet-50",
      border: "border-violet-200",
    },
    gray: {
      primary: "bg-gray-700",
      text: "text-gray-700",
      light: "bg-gray-50",
      border: "border-gray-200",
    },
  }

  const colors = colorClasses[colorScheme] || colorClasses.blue

  return (
    <div className="bg-white shadow-lg w-full h-full">
      {/* Header */}
      <div className={`${colors.primary} text-white p-8`}>
        <h1 className="text-2xl font-bold">{personalInfo.fullName || "Your Name"}</h1>
        <p className="text-lg mt-1">{personalInfo.title || "Professional Title"}</p>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
          {personalInfo.email && <div>Email: {personalInfo.email}</div>}
          {personalInfo.phone && <div>Phone: {personalInfo.phone}</div>}
          {personalInfo.location && <div>Location: {personalInfo.location}</div>}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Main Column */}
        <div className="w-full md:w-2/3 p-6 space-y-6">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className={`text-lg font-bold pb-1 mb-2 border-b-2 ${colors.border} ${colors.text}`}>
                Professional Summary
              </h2>
              <p>{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className={`text-lg font-bold pb-1 mb-4 border-b-2 ${colors.border} ${colors.text}`}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <h3 className="font-bold">{exp.position}</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{exp.company}</span>
                      <span>
                        {exp.startDate} - {exp.endDate || "Present"}
                      </span>
                    </div>
                    {exp.location && <div className="text-sm mb-2">{exp.location}</div>}
                    {exp.description && <p className="text-sm">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className={`text-lg font-bold pb-1 mb-4 border-b-2 ${colors.border} ${colors.text}`}>Education</h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{edu.institution}</span>
                      <span>
                        {edu.startDate} - {edu.endDate || "Present"}
                      </span>
                    </div>
                    {edu.description && <p className="text-sm">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <div>
              <h2 className={`text-lg font-bold pb-1 mb-4 border-b-2 ${colors.border} ${colors.text}`}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certificates.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{cert.name}</h3>
                    <div className="text-sm">
                      {cert.issuer}
                      {cert.date && ` • ${cert.date}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={`w-full md:w-1/3 p-6 ${colors.light}`}>
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-bold pb-1 mb-3 border-b-2 ${colors.border} ${colors.text}`}>Skills</h2>
              <ul className="space-y-1">
                {skills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${colors.primary}`}></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className={`text-lg font-bold pb-1 mb-3 border-b-2 ${colors.border} ${colors.text}`}>Languages</h2>
              <ul className="space-y-1">
                {languages.map((lang, index) => (
                  <li key={index}>
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-sm text-secondary-500"> - {lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfessionalTemplate

