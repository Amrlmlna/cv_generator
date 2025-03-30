import PropTypes from "prop-types";

const ClassicTemplate = ({ data }) => {
  const { personalInfo, education, experience, skills, projects } = data;

  return (
    <div className="bg-white shadow-lg w-full h-full overflow-hidden">
      {/* Header */}
      <div className="bg-blue-700 text-white p-4 md:p-8">
        <h1 className="text-xl md:text-3xl font-bold">
          {personalInfo?.full_name || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-2 md:gap-x-4 gap-y-1 text-xs md:text-sm">
          {personalInfo?.email && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 md:h-4 md:w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 md:h-4 md:w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="truncate">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.address && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 md:h-4 md:w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{personalInfo.address}</span>
            </div>
          )}
          {personalInfo?.linkedin && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 md:h-4 md:w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
              <span className="truncate">LinkedIn</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Summary */}
        {personalInfo?.summary && (
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold border-b-2 border-blue-700 pb-1 mb-2">
              Summary
            </h2>
            <p className="text-xs md:text-sm line-clamp-3 md:line-clamp-none">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold border-b-2 border-blue-700 pb-1 mb-2">
              Experience
            </h2>
            <div className="space-y-3 md:space-y-4">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm md:text-base truncate">
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
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )}`
                        : ""}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700">
                    {exp.company}
                  </p>
                  {exp.description && (
                    <p className="mt-1 text-xs md:text-sm line-clamp-2 md:line-clamp-none">
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
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold border-b-2 border-blue-700 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-3 md:space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm md:text-base truncate">
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
                    <p className="mt-1 text-xs md:text-sm">GPA: {edu.gpa}</p>
                  )}
                  {edu.description && (
                    <p className="mt-1 text-xs md:text-sm line-clamp-2 md:line-clamp-none">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold border-b-2 border-blue-700 pb-1 mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1 md:gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-0.5 rounded-full text-xs md:text-sm"
                >
                  {skill.name}{" "}
                  {skill.proficiency &&
                    `(${skill.proficiency.substring(0, 3)})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div>
            <h2 className="text-lg md:text-xl font-bold border-b-2 border-blue-700 pb-1 mb-2">
              Projects
            </h2>
            <div className="space-y-3 md:space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm md:text-base truncate">
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
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )}`
                        : ""}
                    </span>
                  </div>
                  {project.description && (
                    <p className="mt-1 text-xs md:text-sm line-clamp-2 md:line-clamp-none">
                      {project.description}
                    </p>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-1 inline-block text-xs md:text-sm"
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
    </div>
  );
};

ClassicTemplate.propTypes = {
  data: PropTypes.shape({
    personalInfo: PropTypes.object,
    education: PropTypes.array,
    experience: PropTypes.array,
    skills: PropTypes.array,
    projects: PropTypes.array,
  }).isRequired,
};

export default ClassicTemplate;
