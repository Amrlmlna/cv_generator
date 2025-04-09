import useCV from "../../../store/cvStore"

const ModernTemplate = () => {
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
      <div className="p-8">
        <h1 className="text-3xl font-bold">{personalInfo.fullName || "Your Name"}</h1>
        <div className={`h-1 w-24 my-3 ${colors.primary}`}></div>
        <p className="text-lg mt-1">{personalInfo.title || "Professional Title"}</p>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors.primary}`}></div>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors.primary}`}></div>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors.primary}`}></div>
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-4">
        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className={`text-lg font-bold mb-3 ${colors.text} flex items-center`}>
              <div className={`w-4 h-4 mr-2 ${colors.primary}`}></div>
              About Me
            </h2>
            <p className="pl-6">{personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className={`text-lg font-bold mb-4 ${colors.text} flex items-center`}>
                  <div className={`w-4 h-4 mr-2 ${colors.primary}`}></div>
                  Work Experience
                </h2>
                <div className="space-y-4 pl-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative">
                      <div className={`absolute left-0 top-0 w-1 h-full ${colors.primary} -ml-6`}></div>
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
                <h2 className={`text-lg font-bold mb-4 ${colors.text} flex items-center`}>
                  <div className={`w-4 h-4 mr-2 ${colors.primary}`}></div>
                  Education
                </h2>
                <div className="space-y-4 pl-6">
                  {education.map((edu, index) => (
                    <div key={index} className="relative">
                      <div className={`absolute left-0 top-0 w-1 h-full ${colors.primary} -ml-6`}></div>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className={`text-lg font-bold mb-3 ${colors.text} flex items-center`}>
                  <div className={`w-4 h-4 mr-2 ${colors.primary}`}></div>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 pl-6">
                  {skills.map((skill, index) => (
                    <div key={index} className={`px-3 py-1 rounded-full text-sm ${colors.light} ${colors.text}`}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className={`text-lg font-bold mb-3 ${colors.text} flex items-center`}>
                  <div className={`w-4 h-4 mr-2 ${colors.primary}`}></div>
                  Languages
                </h2>
                <ul className="space-y-1 pl-6">
                  {languages.map((lang, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{lang.language}</span>
                      <span className="text-sm text-secondary-500">{lang.proficiency}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
              <div>
                <h2 className={`text-lg font-bold mb-3 ${colors.text} flex items-center`}>
                  <div className={`w-4 h-4 mr-2 ${colors.primary}`}></div>
                  Certifications
                </h2>
                <div className="space-y-2 pl-6">
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
        </div>
      </div>
    </div>
  )
}

export default ModernTemplate

