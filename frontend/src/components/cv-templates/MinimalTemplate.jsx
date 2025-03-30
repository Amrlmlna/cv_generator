import PropTypes from "prop-types";

const MinimalTemplate = ({ data }) => {
  const { personalInfo, education, experience, skills, projects } = data;

  return (
    <div className="bg-white shadow-lg w-full h-full overflow-hidden p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-4 md:mb-8 border-b pb-3 md:pb-4">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">
          {personalInfo?.full_name || "Your Name"}
        </h1>
        <div className="mt-1 md:mt-2 flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-1 text-xs md:text-sm text-gray-600">
          {personalInfo?.email && (
            <div className="truncate">{personalInfo.email}</div>
          )}
          {personalInfo?.phone && (
            <div className="truncate">{personalInfo.phone}</div>
          )}
          {personalInfo?.address && (
            <div className="truncate">{personalInfo.address}</div>
          )}
        </div>
        <div className="mt-1 md:mt-2 flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-1 text-xs md:text-sm text-gray-600">
          {personalInfo?.linkedin && (
            <a
              href={`https://linkedin.com/in/${personalInfo.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              LinkedIn
            </a>
          )}
          {personalInfo?.github && (
            <a
              href={`https://github.com/${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              GitHub
            </a>
          )}
          {personalInfo?.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo?.summary && (
        <div className="mb-3 md:mb-6">
          <p className="text-center text-xs md:text-sm text-gray-700 line-clamp-2 md:line-clamp-none">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="md:w-2/3">
          {/* Experience */}
          {experience && experience.length > 0 && (
            <div className="mb-3 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Experience
              </h2>
              <div className="space-y-2 md:space-y-4">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm md:text-base text-gray-800 truncate">
                        {exp.position}
                      </h3>
                      <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap ml-2">
                        {exp.start_date &&
                          new Date(exp.start_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}{" "}
                        -
                        {exp.is_current
                          ? " Present"
                          : exp.end_date
                          ? ` ${new Date(exp.end_date).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "short" }
                            )}`
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-700">
                      {exp.company}
                    </p>
                    {exp.description && (
                      <p className="mt-1 text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-none">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="mb-3 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Education
              </h2>
              <div className="space-y-2 md:space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm md:text-base text-gray-800 truncate">
                        {edu.degree}
                        {edu.field_of_study ? `, ${edu.field_of_study}` : ""}
                      </h3>
                      <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap ml-2">
                        {edu.start_date &&
                          new Date(edu.start_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}{" "}
                        -
                        {edu.end_date
                          ? ` ${new Date(edu.end_date).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "short" }
                            )}`
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-700">
                      {edu.institution}
                    </p>
                    {edu.gpa && (
                      <p className="mt-1 text-xs md:text-sm text-gray-600">
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.description && (
                      <p className="mt-1 text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-none">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Projects
              </h2>
              <div className="space-y-2 md:space-y-4">
                {projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm md:text-base text-gray-800 truncate">
                        {project.name}
                      </h3>
                      <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap ml-2">
                        {project.start_date &&
                          new Date(project.start_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )}{" "}
                        -
                        {project.end_date
                          ? ` ${new Date(project.end_date).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "short" }
                            )}`
                          : ""}
                      </span>
                    </div>
                    {project.description && (
                      <p className="mt-1 text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-none">
                        {project.description}
                      </p>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 mt-1 inline-block text-xs md:text-sm"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/3">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-3 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs md:text-sm text-gray-700"
                  >
                    {skill.name}
                    {index < skills.length - 1 ? " • " : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MinimalTemplate.propTypes = {
  data: PropTypes.shape({
    personalInfo: PropTypes.object,
    education: PropTypes.array,
    experience: PropTypes.array,
    skills: PropTypes.array,
    projects: PropTypes.array,
  }).isRequired,
};

export default MinimalTemplate;
