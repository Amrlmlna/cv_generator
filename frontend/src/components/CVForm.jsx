"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CompactCVPreview from "./CompactCVPreview";
import {
  User,
  Book,
  Briefcase,
  Wrench,
  FileText,
  Eye,
  EyeOff,
  ChevronRight,
  Save,
} from "lucide-react";

const CVForm = ({ onSubmitSuccess }) => {
  const [activeTab, setActiveTab] = useState("basic");
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
  const [categories, setCategories] = useState([]);

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

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });

        if (res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchPersonalInfo();
    fetchCategories();
  }, [navigate]);

  useEffect(() => {
    // Always provide complete data structure for preview
    setPreviewData({
      personalInfo: {
        ...personalInfo,
      },
      education: education.length > 0 ? education : [],
      experience: experience.length > 0 ? experience : [],
      skills: skills.length > 0 ? skills : [],
      projects: projects.length > 0 ? projects : [],
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

      // Prepare data for submission
      const cvData = {
        title,
        template: selectedTemplate,
        personalInfo,
        education,
        experience,
        skills,
        projects,
        categories: [1], // Default to first category if none selected
        isPublic,
      };

      // Send data to the backend
      const response = await axios.post("/api/cvs", cvData, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      setSuccess(true);
      setLoading(false);

      // Call the success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(response.data.cv);
      }

      // Redirect to view CV page
      setTimeout(() => {
        navigate(`/view-cv/${response.data.cv.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error creating CV:", err);
      setError(
        err.response?.data?.message || "Failed to create CV. Please try again."
      );
      setLoading(false);
    }
  };

  const nextTab = () => {
    if (activeTab === "basic") setActiveTab("education");
    else if (activeTab === "education") setActiveTab("experience");
    else if (activeTab === "experience") setActiveTab("skills");
    else if (activeTab === "skills") setActiveTab("projects");
    else if (activeTab === "projects") setActiveTab("review");
  };

  const prevTab = () => {
    if (activeTab === "review") setActiveTab("projects");
    else if (activeTab === "projects") setActiveTab("skills");
    else if (activeTab === "skills") setActiveTab("experience");
    else if (activeTab === "experience") setActiveTab("education");
    else if (activeTab === "education") setActiveTab("basic");
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    let total = 0;
    let completed = 0;

    // Basic info (title, template, visibility)
    total += 3;
    if (title) completed += 1;
    if (selectedTemplate) completed += 1;
    completed += 1; // Visibility is always set

    // Personal info
    const personalInfoFields = Object.keys(personalInfo).length;
    total += personalInfoFields;
    completed += Object.values(personalInfo).filter((val) => val).length;

    // Education, Experience, Skills, Projects
    // Just check if they exist for simplicity
    total += 4;
    if (education.length > 0) completed += 1;
    if (experience.length > 0) completed += 1;
    if (skills.length > 0) completed += 1;
    if (projects.length > 0) completed += 1;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>

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
                <label htmlFor="isPublic" className="flex items-center">
                  {isPublic ? (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      <span>Public CV</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      <span>Private CV</span>
                    </>
                  )}
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {isPublic
                  ? "Public CVs can be viewed by anyone with the link"
                  : "Private CVs can only be viewed by you"}
              </p>
            </div>

            {/* Template Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">Select Template</h2>
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
              <h2 className="text-lg font-bold mb-4">Personal Information</h2>

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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextTab}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case "education":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
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
                        updateEducation(index, "field_of_study", e.target.value)
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

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prevTab}
                className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextTab}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
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
                No experience added yet. Click the button above to add your work
                experience.
              </p>
            )}

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prevTab}
                className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextTab}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
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
                No skills added yet. Click the button above to add your skills.
              </p>
            )}

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prevTab}
                className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextTab}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
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

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prevTab}
                className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextTab}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Review & Submit</h2>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">CV Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Title:</strong> {title || "Not specified"}
                </p>
                <p>
                  <strong>Template:</strong>{" "}
                  {selectedTemplate.charAt(0).toUpperCase() +
                    selectedTemplate.slice(1)}
                </p>
                <p>
                  <strong>Visibility:</strong> {isPublic ? "Public" : "Private"}
                </p>
                <p>
                  <strong>Sections completed:</strong>
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li
                    className={
                      personalInfo.full_name ? "text-green-600" : "text-red-600"
                    }
                  >
                    Personal Information {personalInfo.full_name ? "✓" : "✗"}
                  </li>
                  <li
                    className={
                      education.length > 0
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    Education {education.length > 0 ? "✓" : "(Optional)"}
                  </li>
                  <li
                    className={
                      experience.length > 0
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    Experience {experience.length > 0 ? "✓" : "(Optional)"}
                  </li>
                  <li
                    className={
                      skills.length > 0 ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    Skills {skills.length > 0 ? "✓" : "(Optional)"}
                  </li>
                  <li
                    className={
                      projects.length > 0 ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    Projects {projects.length > 0 ? "✓" : "(Optional)"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prevTab}
                className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                {loading ? "Creating..." : "Create CV"}{" "}
                <Save className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Area - Left Side */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">Create Your CV</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {completionPercentage}% Complete
            </p>
          </div>

          <div className="flex mb-4 border-b">
            <button
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-2 font-medium ${
                activeTab === "basic"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="inline-block mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Basic</span>
            </button>

            <button
              onClick={() => setActiveTab("education")}
              className={`px-4 py-2 font-medium ${
                activeTab === "education"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Book className="inline-block mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
            </button>

            <button
              onClick={() => setActiveTab("experience")}
              className={`px-4 py-2 font-medium ${
                activeTab === "experience"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase className="inline-block mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
            </button>

            <button
              onClick={() => setActiveTab("skills")}
              className={`px-4 py-2 font-medium ${
                activeTab === "skills"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Wrench className="inline-block mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 font-medium ${
                activeTab === "projects"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="inline-block mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </button>

            <button
              onClick={() => setActiveTab("review")}
              className={`px-4 py-2 font-medium ${
                activeTab === "review"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Eye className="inline-block mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Review</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>{renderTabContent()}</form>
        </div>

        {/* Preview Area - Right Side */}
        <div className="lg:col-span-1">
          <CompactCVPreview
            formData={previewData}
            template={selectedTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default CVForm;
