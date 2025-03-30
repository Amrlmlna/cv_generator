import PropTypes from "prop-types";

const ModernTemplate = ({ data }) => {
  const { personalInfo, education, experience, skills, projects } = data;

  return (
    <div className="bg-white shadow-lg w-full overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-full md:w-1/3 p-4 md:p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl md:text-2xl font-bold">
            {personalInfo?.full_name || "John Doe"}
          </h1>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-2 border-b border-gray-600 pb-1">
            Contact
          </h2>
          <div className="space-y-1 text-xs md:text-sm">
            {personalInfo?.email && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0"
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
                  className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0"
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
                  className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0"
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
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base md:text-lg font-semibold mb-2 border-b border-gray-600 pb-1">
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="truncate">{skill.name}</span>
                    {skill.proficiency && (
                      <span className="text-xs">
                        {skill.proficiency === "beginner" && "Basic"}
                        {skill.proficiency === "intermediate" && "Int."}
                        {skill.proficiency === "advanced" && "Adv."}
                        {skill.proficiency === "expert" && "Exp."}
                      </span>
                    )}
                  </div>
                  {skill.proficiency && (
                    <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                      <div
                        className="bg-green-500 h-1 rounded-full"
                        style={{
                          width:
                            skill.proficiency === "beginner"
                              ? "25%"
                              : skill.proficiency === "intermediate"
                              ? "50%"
                              : skill.proficiency === "advanced"
                              ? "75%"
                              : "100%",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div>
          <h2 className="text-base md:text-lg font-semibold mb-2 border-b border-gray-600 pb-1">
            Links
          </h2>
          <div className="space-y-1 text-xs md:text-sm">
            {personalInfo?.linkedin && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
                <span className="truncate">LinkedIn</span>
              </div>
            )}
            {personalInfo?.github && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="truncate">GitHub</span>
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span className="truncate">Portfolio</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 p-4 md:p-6 overflow-y-auto">
        {/* Summary */}
        {personalInfo?.summary && (
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs md:text-sm text-gray-700 line-clamp-4 md:line-clamp-none">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              Experience
            </h2>
            <div className="space-y-3 md:space-y-4">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-2 border-gray-300 pl-3 md:pl-4 ml-1 md:ml-2 relative"
                >
                  <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full -left-[5px] md:-left-[7px] top-1.5"></div>
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
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              Education
            </h2>
            <div className="space-y-3 md:space-y-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="border-l-2 border-gray-300 pl-3 md:pl-4 ml-1 md:ml-2 relative"
                >
                  <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full -left-[5px] md:-left-[7px] top-1.5"></div>
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
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              Projects
            </h2>
            <div className="space-y-3 md:space-y-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="border-l-2 border-gray-300 pl-3 md:pl-4 ml-1 md:ml-2 relative"
                >
                  <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full -left-[5px] md:-left-[7px] top-1.5"></div>
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
                            {
                              year: "numeric",
                              month: "short",
                            }
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

ModernTemplate.propTypes = {
  data: PropTypes.shape({
    personalInfo: PropTypes.object,
    education: PropTypes.array,
    experience: PropTypes.array,
    skills: PropTypes.array,
    projects: PropTypes.array,
  }).isRequired,
};

export default ModernTemplate;
