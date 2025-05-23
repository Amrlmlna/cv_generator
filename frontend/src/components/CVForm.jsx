"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CVPreview from "./CVPreview";

const CVForm = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [previewData, setPreviewData] = useState({
    personalInfo: {},
    education: [],
    experience: [],
    skills: [],
    projects: [],
  });

  const [personalInfo, setPersonalInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  });

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }

    // Fetch user's personal info if available
    const fetchPersonalInfo = async () => {
      try {
        const res = await axios.get("/api/users/me", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });

        if (res.data.personalInfo) {
          setPersonalInfo(res.data.personalInfo);
        }
      } catch (err) {
        console.error("Error fetching personal info:", err);
      }
    };

    fetchPersonalInfo();
  }, [navigate]);

  useEffect(() => {
    setPreviewData({
      personalInfo,
      education,
      experience,
      skills,
      projects,
    });
  }, [personalInfo, education, experience, skills, projects]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        gpa: "",
        description: "",
      },
    ]);
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const removeEducation = (index) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      },
    ]);
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...experience];
    newExperience[index][field] = value;
    setExperience(newExperience);
  };

  const removeExperience = (index) => {
    const newExperience = [...experience];
    newExperience.splice(index, 1);
    setExperience(newExperience);
  };

  const addSkill = () => {
    setSkills([...skills, { name: "", proficiency: "intermediate" }]);
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const removeSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        url: "",
      },
    ]);
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const removeProject = (index) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Please provide a title for your CV");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, create or update personal info
      const personalInfoRes = await axios.post(
        "/api/users/personal-info",
        personalInfo,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );

      const personalInfoId = personalInfoRes.data.id;

      // Create CV
      const cvData = {
        title,
        template: selectedTemplate,
        is_public: isPublic,
        personal_info_id: personalInfoId,
      };

      const cvRes = await axios.post("/api/cvs", cvData, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      const cvId = cvRes.data.id;

      // Add education
      for (const edu of education) {
        await axios.post(
          "/api/cvs/education",
          {
            ...edu,
            personal_info_id: personalInfoId,
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
      }

      // Add experience
      for (const exp of experience) {
        await axios.post(
          "/api/cvs/experience",
          {
            ...exp,
            personal_info_id: personalInfoId,
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
      }

      // Add skills
      for (const skill of skills) {
        await axios.post(
          "/api/cvs/skills",
          {
            ...skill,
            personal_info_id: personalInfoId,
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
      }

      // Add projects
      for (const project of projects) {
        await axios.post(
          "/api/cvs/projects",
          {
            ...project,
            personal_info_id: personalInfoId,
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
      }

      setSuccess(true);
      setLoading(false);

      // Redirect to view CV page
      setTimeout(() => {
        navigate(`/view-cv/${cvId}`);
      }, 2000);
    } catch (err) {
      console.error("Error creating CV:", err);
      setError("Failed to create CV. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create Your CV</h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          CV created successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Column */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                CV Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., Software Developer CV"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Visibility
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isPublic">Make this CV public</label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Public CVs can be viewed by anyone with the link
              </p>
            </div>

            {/* Template Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Select Template</h2>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`border rounded-lg p-2 cursor-pointer ${
                    selectedTemplate === "classic"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate("classic")}
                >
                  <div className="aspect-w-8 aspect-h-11 bg-gray-100 mb-2 flex items-center justify-center">
                    <div className="w-full h-full p-2">
                      <div className="w-full h-2 bg-blue-500 mb-2"></div>
                      <div className="w-1/2 h-2 bg-gray-300 mb-4"></div>
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-gray-300"></div>
                        <div className="w-full h-1 bg-gray-300"></div>
                        <div className="w-3/4 h-1 bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm font-medium">Classic</p>
                </div>

                <div
                  className={`border rounded-lg p-2 cursor-pointer ${
                    selectedTemplate === "modern"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate("modern")}
                >
                  <div className="aspect-w-8 aspect-h-11 bg-gray-100 mb-2 flex items-center justify-center">
                    <div className="w-full h-full p-2 flex">
                      <div className="w-1/3 h-full bg-gray-700"></div>
                      <div className="w-2/3 h-full p-1">
                        <div className="w-3/4 h-1 bg-gray-300 mb-2"></div>
                        <div className="space-y-1">
                          <div className="w-full h-1 bg-gray-300"></div>
                          <div className="w-full h-1 bg-gray-300"></div>
                          <div className="w-3/4 h-1 bg-gray-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm font-medium">Modern</p>
                </div>

                <div
                  className={`border rounded-lg p-2 cursor-pointer ${
                    selectedTemplate === "minimal"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate("minimal")}
                >
                  <div className="aspect-w-8 aspect-h-11 bg-gray-100 mb-2 flex items-center justify-center">
                    <div className="w-full h-full p-2">
                      <div className="w-1/2 mx-auto h-2 bg-gray-300 mb-4"></div>
                      <div className="w-3/4 mx-auto h-1 bg-gray-300 mb-4"></div>
                      <div className="space-y-2">
                        <div className="w-full h-1 bg-gray-300"></div>
                        <div className="w-full h-1 bg-gray-300"></div>
                        <div className="w-3/4 h-1 bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm font-medium">Minimal</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={personalInfo.full_name}
                    onChange={handlePersonalInfoChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={personalInfo.linkedin}
                    onChange={handlePersonalInfoChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="github"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    GitHub
                  </label>
                  <input
                    type="text"
                    id="github"
                    name="github"
                    value={personalInfo.github}
                    onChange={handlePersonalInfoChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={personalInfo.website}
                    onChange={handlePersonalInfoChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="summary"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Professional Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={personalInfo.summary}
                  onChange={handlePersonalInfoChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                ></textarea>
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Education</h2>
                <button
                  type="button"
                  onClick={addEducation}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  + Add Education
                </button>
              </div>

              {education.map((edu, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">Education #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(index, "institution", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(index, "degree", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.field_of_study}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "field_of_study",
                            e.target.value
                          )
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        GPA
                      </label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) =>
                          updateEducation(index, "gpa", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={edu.start_date}
                        onChange={(e) =>
                          updateEducation(index, "start_date", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={edu.end_date}
                        onChange={(e) =>
                          updateEducation(index, "end_date", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      value={edu.description}
                      onChange={(e) =>
                        updateEducation(index, "description", e.target.value)
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              ))}

              {education.length === 0 && (
                <p className="text-gray-500 italic">
                  No education added yet. Click the button above to add your
                  education history.
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Experience</h2>
                <button
                  type="button"
                  onClick={addExperience}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  + Add Experience
                </button>
              </div>

              {experience.map((exp, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">Experience #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(index, "position", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={exp.start_date}
                        onChange={(e) =>
                          updateExperience(index, "start_date", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={exp.end_date}
                        onChange={(e) =>
                          updateExperience(index, "end_date", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled={exp.is_current}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exp.is_current}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "is_current",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">I currently work here</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(index, "description", e.target.value)
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              ))}

              {experience.length === 0 && (
                <p className="text-gray-500 italic">
                  No experience added yet. Click the button above to add your
                  work experience.
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Skills</h2>
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  + Add Skill
                </button>
              </div>

              {skills.map((skill, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">Skill #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(index, "name", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Proficiency
                      </label>
                      <select
                        value={skill.proficiency}
                        onChange={(e) =>
                          updateSkill(index, "proficiency", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {skills.length === 0 && (
                <p className="text-gray-500 italic">
                  No skills added yet. Click the button above to add your
                  skills.
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Projects</h2>
                <button
                  type="button"
                  onClick={addProject}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  + Add Project
                </button>
              </div>

              {projects.map((project, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">Project #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) =>
                          updateProject(index, "name", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Project URL
                      </label>
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) =>
                          updateProject(index, "url", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={project.start_date}
                        onChange={(e) =>
                          updateProject(index, "start_date", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={project.end_date}
                        onChange={(e) =>
                          updateProject(index, "end_date", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        updateProject(index, "description", e.target.value)
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <p className="text-gray-500 italic">
                  No projects added yet. Click the button above to add your
                  projects.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create CV"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Column */}
        <div className="hidden lg:block sticky top-4 h-[calc(100vh-2rem)]">
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          <CVPreview formData={previewData} template={selectedTemplate} />
        </div>
      </div>
    </div>
  );
};

export default CVForm;
