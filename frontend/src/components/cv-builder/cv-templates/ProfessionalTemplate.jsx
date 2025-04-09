import useCV from "../../../store/cvStore";
import { getDisplayData } from "../../../utils/cv-template-helpers";

const ProfessionalTemplate = ({ showPlaceholders = true }) => {
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
    blue: "bg-primary-600 text-white",
    green: "bg-emerald-600 text-white",
    purple: "bg-violet-600 text-white",
    gray: "bg-gray-700 text-white",
  };

  const headerColor = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="w-full h-full bg-white shadow-lg">
      {/* Header */}
      <div className={`${headerColor} px-8 py-6`}>
        <h1 className="text-3xl font-bold">{personalInfo.fullName}</h1>
        <p className="text-xl mt-1">{personalInfo.title}</p>
      </div>

      <div className="grid grid-cols-3 gap-6 p-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              Contact
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> {personalInfo.email}
              </p>
              <p>
                <strong>Phone:</strong> {personalInfo.phone}
              </p>
              <p>
                <strong>Location:</strong> {personalInfo.location}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">Skills</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              Languages
            </h2>
            <ul className="space-y-1 text-sm">
              {languages.map((lang, index) => (
                <li key={index}>
                  <span className="font-medium">{lang.language}</span> -{" "}
                  {lang.proficiency}
                </li>
              ))}
            </ul>
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold border-b pb-2 mb-3">
                Certifications
              </h2>
              <ul className="space-y-2 text-sm">
                {certificates.map((cert, index) => (
                  <li key={index}>
                    <div className="font-medium">{cert.name}</div>
                    <div>{cert.issuer}</div>
                    <div className="text-xs text-gray-600">{cert.date}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              Professional Summary
            </h2>
            <p className="text-sm">{personalInfo.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="font-medium">{exp.position}</h3>
                  <div className="text-sm flex justify-between">
                    <span>
                      {exp.company}, {exp.location}
                    </span>
                    <span className="text-gray-600">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <div className="text-sm flex justify-between">
                    <span>{edu.institution}</span>
                    <span className="text-gray-600">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
