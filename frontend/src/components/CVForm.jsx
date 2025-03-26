"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik"
import * as Yup from "yup"
import { FaPlus, FaTrash, FaSpinner } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"

// CV form validation schema
const validationSchema = Yup.object({
  title: Yup.string().required("CV title is required"),
  template: Yup.string().required("Template is required"),
  personalInfo: Yup.object({
    full_name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    address: Yup.string(),
    linkedin: Yup.string(),
    github: Yup.string(),
    website: Yup.string(),
    summary: Yup.string(),
  }),
  education: Yup.array().of(
    Yup.object({
      institution: Yup.string().required("Institution is required"),
      degree: Yup.string().required("Degree is required"),
      field_of_study: Yup.string(),
      start_date: Yup.string(),
      end_date: Yup.string(),
      gpa: Yup.number().min(0).max(4),
      description: Yup.string(),
    }),
  ),
  experience: Yup.array().of(
    Yup.object({
      company: Yup.string().required("Company is required"),
      position: Yup.string().required("Position is required"),
      start_date: Yup.string(),
      end_date: Yup.string(),
      is_current: Yup.boolean(),
      description: Yup.string(),
    }),
  ),
  skills: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Skill name is required"),
      proficiency: Yup.string().oneOf(["beginner", "intermediate", "advanced", "expert"]),
    }),
  ),
  projects: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Project name is required"),
      description: Yup.string(),
      start_date: Yup.string(),
      end_date: Yup.string(),
      url: Yup.string(),
    }),
  ),
  categories: Yup.array().min(1, "Select at least one category"),
})

const CVForm = ({ onSubmitSuccess }) => {
  const [categories, setCategories] = useState([])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Templates
  const templates = [
    { id: "formal", name: "Formal" },
    { id: "modern", name: "Modern" },
    { id: "minimalist", name: "Minimalist" },
    { id: "creative", name: "Creative" },
  ]

  // Fetch categories on component mount
  useState(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories")
        if (response.data.success) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories")
      }
    }

    fetchCategories()
  }, [])

  // Initial form values
  const initialValues = {
    title: "",
    template: "formal",
    personalInfo: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      github: "",
      website: "",
      summary: "",
    },
    education: [
      {
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        gpa: "",
        description: "",
      },
    ],
    experience: [
      {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      },
    ],
    skills: [
      {
        name: "",
        proficiency: "intermediate",
      },
    ],
    projects: [
      {
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        url: "",
      },
    ],
    categories: [],
    isPublic: true,
  }

  // Generate AI suggestions
  const generateAISuggestions = async (values) => {
    setIsGeneratingAI(true)

    try {
      const response = await axios.post("/api/ai/generate-suggestions", values)

      if (response.data.success) {
        setAiSuggestions(response.data.suggestions)
        toast.success("AI suggestions generated successfully!")
      }
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
      toast.error("Failed to generate AI suggestions. Please try again.")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Apply AI suggestions to form
  const applyAISuggestions = (setFieldValue) => {
    if (aiSuggestions) {
      if (aiSuggestions.summary) {
        setFieldValue("personalInfo.summary", aiSuggestions.summary)
      }

      toast.success("AI suggestions applied!")
    }
  }

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true)

    try {
      // Include AI suggestions if available
      if (aiSuggestions) {
        values.aiSuggestions = JSON.stringify(aiSuggestions)
      }

      const response = await axios.post("/api/cvs", values)

      if (response.data.success) {
        toast.success("CV created successfully!")
        resetForm()
        setAiSuggestions(null)
        setCurrentStep(1)

        // Call the success callback if provided
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data.cv)
        }
      }
    } catch (error) {
      console.error("Error creating CV:", error)
      toast.error("Failed to create CV. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Next step
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  // Previous step
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, setFieldValue, isValid }) => (
        <Form className="space-y-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="form-label">
                    CV Title
                  </label>
                  <Field name="title" type="text" className="form-input" />
                  <ErrorMessage name="title" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="template" className="form-label">
                    Template
                  </label>
                  <Field as="select" name="template" className="form-input">
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="template" component="div" className="form-error" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="personalInfo.full_name" className="form-label">
                    Full Name
                  </label>
                  <Field name="personalInfo.full_name" type="text" className="form-input" />
                  <ErrorMessage name="personalInfo.full_name" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="personalInfo.email" className="form-label">
                    Email
                  </label>
                  <Field name="personalInfo.email" type="email" className="form-input" />
                  <ErrorMessage name="personalInfo.email" component="div" className="form-error" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="personalInfo.phone" className="form-label">
                    Phone
                  </label>
                  <Field name="personalInfo.phone" type="text" className="form-input" />
                  <ErrorMessage name="personalInfo.phone" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="personalInfo.address" className="form-label">
                    Address
                  </label>
                  <Field name="personalInfo.address" type="text" className="form-input" />
                  <ErrorMessage name="personalInfo.address" component="div" className="form-error" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="personalInfo.linkedin" className="form-label">
                    LinkedIn
                  </label>
                  <Field name="personalInfo.linkedin" type="text" className="form-input" />
                  <ErrorMessage name="personalInfo.linkedin" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="personalInfo.github" className="form-label">
                    GitHub
                  </label>
                  <Field name="personalInfo.github" type="text" className="form-input" />
                  <ErrorMessage name="personalInfo.github" component="div" className="form-error" />
                </div>

                <div>
                  <label htmlFor="personalInfo.website" className="form-label">
                    Website
                  </label>
                  <Field name="personalInfo.website" type="text" className="form-input" />
                  <ErrorMessage name="personalInfo.website" component="div" className="form-error" />
                </div>
              </div>

              <div>
                <label htmlFor="personalInfo.summary" className="form-label">
                  Professional Summary
                </label>
                <Field as="textarea" name="personalInfo.summary" rows="4" className="form-input" />
                <ErrorMessage name="personalInfo.summary" component="div" className="form-error" />
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={goToNextStep} className="btn btn-primary">
                  Next: Education
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Education</h2>

              <FieldArray name="education">
                {({ remove, push }) => (
                  <div className="space-y-6">
                    {values.education.map((_, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`education.${index}.institution`} className="form-label">
                              Institution
                            </label>
                            <Field name={`education.${index}.institution`} type="text" className="form-input" />
                            <ErrorMessage
                              name={`education.${index}.institution`}
                              component="div"
                              className="form-error"
                            />
                          </div>

                          <div>
                            <label htmlFor={`education.${index}.degree`} className="form-label">
                              Degree
                            </label>
                            <Field name={`education.${index}.degree`} type="text" className="form-input" />
                            <ErrorMessage name={`education.${index}.degree`} component="div" className="form-error" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor={`education.${index}.field_of_study`} className="form-label">
                              Field of Study
                            </label>
                            <Field name={`education.${index}.field_of_study`} type="text" className="form-input" />
                            <ErrorMessage
                              name={`education.${index}.field_of_study`}
                              component="div"
                              className="form-error"
                            />
                          </div>

                          <div>
                            <label htmlFor={`education.${index}.start_date`} className="form-label">
                              Start Date
                            </label>
                            <Field name={`education.${index}.start_date`} type="date" className="form-input" />
                            <ErrorMessage
                              name={`education.${index}.start_date`}
                              component="div"
                              className="form-error"
                            />
                          </div>

                          <div>
                            <label htmlFor={`education.${index}.end_date`} className="form-label">
                              End Date
                            </label>
                            <Field name={`education.${index}.end_date`} type="date" className="form-input" />
                            <ErrorMessage name={`education.${index}.end_date`} component="div" className="form-error" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`education.${index}.gpa`} className="form-label">
                              GPA
                            </label>
                            <Field name={`education.${index}.gpa`} type="number" step="0.01" className="form-input" />
                            <ErrorMessage name={`education.${index}.gpa`} component="div" className="form-error" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`education.${index}.description`} className="form-label">
                            Description
                          </label>
                          <Field
                            as="textarea"
                            name={`education.${index}.description`}
                            rows="3"
                            className="form-input"
                          />
                          <ErrorMessage
                            name={`education.${index}.description`}
                            component="div"
                            className="form-error"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({
                          institution: "",
                          degree: "",
                          field_of_study: "",
                          start_date: "",
                          end_date: "",
                          gpa: "",
                          description: "",
                        })
                      }
                      className="btn btn-outline flex items-center"
                    >
                      <FaPlus className="mr-2" /> Add Education
                    </button>
                  </div>
                )}
              </FieldArray>

              <div className="flex justify-between">
                <button type="button" onClick={goToPreviousStep} className="btn btn-outline">
                  Previous: Personal Info
                </button>
                <button type="button" onClick={goToNextStep} className="btn btn-primary">
                  Next: Experience
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Work Experience</h2>

              <FieldArray name="experience">
                {({ remove, push }) => (
                  <div className="space-y-6">
                    {values.experience.map((_, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`experience.${index}.company`} className="form-label">
                              Company
                            </label>
                            <Field name={`experience.${index}.company`} type="text" className="form-input" />
                            <ErrorMessage name={`experience.${index}.company`} component="div" className="form-error" />
                          </div>

                          <div>
                            <label htmlFor={`experience.${index}.position`} className="form-label">
                              Position
                            </label>
                            <Field name={`experience.${index}.position`} type="text" className="form-input" />
                            <ErrorMessage
                              name={`experience.${index}.position`}
                              component="div"
                              className="form-error"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor={`experience.${index}.start_date`} className="form-label">
                              Start Date
                            </label>
                            <Field name={`experience.${index}.start_date`} type="date" className="form-input" />
                            <ErrorMessage
                              name={`experience.${index}.start_date`}
                              component="div"
                              className="form-error"
                            />
                          </div>

                          <div>
                            <label htmlFor={`experience.${index}.end_date`} className="form-label">
                              End Date
                            </label>
                            <Field
                              name={`experience.${index}.end_date`}
                              type="date"
                              className="form-input"
                              disabled={values.experience[index].is_current}
                            />
                            <ErrorMessage
                              name={`experience.${index}.end_date`}
                              component="div"
                              className="form-error"
                            />
                          </div>

                          <div className="flex items-center">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <Field
                                type="checkbox"
                                name={`experience.${index}.is_current`}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Current Position</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`experience.${index}.description`} className="form-label">
                            Description
                          </label>
                          <Field
                            as="textarea"
                            name={`experience.${index}.description`}
                            rows="3"
                            className="form-input"
                          />
                          <ErrorMessage
                            name={`experience.${index}.description`}
                            component="div"
                            className="form-error"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({
                          company: "",
                          position: "",
                          start_date: "",
                          end_date: "",
                          is_current: false,
                          description: "",
                        })
                      }
                      className="btn btn-outline flex items-center"
                    >
                      <FaPlus className="mr-2" /> Add Experience
                    </button>
                  </div>
                )}
              </FieldArray>

              <div className="flex justify-between">
                <button type="button" onClick={goToPreviousStep} className="btn btn-outline">
                  Previous: Education
                </button>
                <button type="button" onClick={goToNextStep} className="btn btn-primary">
                  Next: Skills
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Skills */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Skills</h2>

              <FieldArray name="skills">
                {({ remove, push }) => (
                  <div className="space-y-6">
                    {values.skills.map((_, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Skill #{index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`skills.${index}.name`} className="form-label">
                              Skill Name
                            </label>
                            <Field name={`skills.${index}.name`} type="text" className="form-input" />
                            <ErrorMessage name={`skills.${index}.name`} component="div" className="form-error" />
                          </div>

                          <div>
                            <label htmlFor={`skills.${index}.proficiency`} className="form-label">
                              Proficiency
                            </label>
                            <Field as="select" name={`skills.${index}.proficiency`} className="form-input">
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                              <option value="expert">Expert</option>
                            </Field>
                            <ErrorMessage name={`skills.${index}.proficiency`} component="div" className="form-error" />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({
                          name: "",
                          proficiency: "intermediate",
                        })
                      }
                      className="btn btn-outline flex items-center"
                    >
                      <FaPlus className="mr-2" /> Add Skill
                    </button>
                  </div>
                )}
              </FieldArray>

              <div className="flex justify-between">
                <button type="button" onClick={goToPreviousStep} className="btn btn-outline">
                  Previous: Experience
                </button>
                <button type="button" onClick={goToNextStep} className="btn btn-primary">
                  Next: Projects
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Projects */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Projects</h2>

              <FieldArray name="projects">
                {({ remove, push }) => (
                  <div className="space-y-6">
                    {values.projects.map((_, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Project #{index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`projects.${index}.name`} className="form-label">
                              Project Name
                            </label>
                            <Field name={`projects.${index}.name`} type="text" className="form-input" />
                            <ErrorMessage name={`projects.${index}.name`} component="div" className="form-error" />
                          </div>

                          <div>
                            <label htmlFor={`projects.${index}.url`} className="form-label">
                              Project URL
                            </label>
                            <Field name={`projects.${index}.url`} type="text" className="form-input" />
                            <ErrorMessage name={`projects.${index}.url`} component="div" className="form-error" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`projects.${index}.start_date`} className="form-label">
                              Start Date
                            </label>
                            <Field name={`projects.${index}.start_date`} type="date" className="form-input" />
                            <ErrorMessage
                              name={`projects.${index}.start_date`}
                              component="div"
                              className="form-error"
                            />
                          </div>

                          <div>
                            <label htmlFor={`projects.${index}.end_date`} className="form-label">
                              End Date
                            </label>
                            <Field name={`projects.${index}.end_date`} type="date" className="form-input" />
                            <ErrorMessage name={`projects.${index}.end_date`} component="div" className="form-error" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`projects.${index}.description`} className="form-label">
                            Description
                          </label>
                          <Field as="textarea" name={`projects.${index}.description`} rows="3" className="form-input" />
                          <ErrorMessage name={`projects.${index}.description`} component="div" className="form-error" />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({
                          name: "",
                          description: "",
                          start_date: "",
                          end_date: "",
                          url: "",
                        })
                      }
                      className="btn btn-outline flex items-center"
                    >
                      <FaPlus className="mr-2" /> Add Project
                    </button>
                  </div>
                )}
              </FieldArray>

              <div className="flex justify-between">
                <button type="button" onClick={goToPreviousStep} className="btn btn-outline">
                  Previous: Skills
                </button>
                <button type="button" onClick={goToNextStep} className="btn btn-primary">
                  Next: Finalize
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Finalize */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Finalize Your CV</h2>

              {/* Categories */}
              <div>
                <label className="form-label">Categories (Select at least one)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-1">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <Field
                        type="checkbox"
                        name="categories"
                        value={category.id.toString()}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                    </label>
                  ))}
                </div>
                <ErrorMessage name="categories" component="div" className="form-error" />
              </div>

              {/* Public/Private */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Field
                    type="checkbox"
                    name="isPublic"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Make this CV public (visible to HR professionals)
                  </span>
                </label>
              </div>

              {/* AI Suggestions */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">AI Suggestions</h3>

                {aiSuggestions ? (
                  <div className="space-y-4">
                    {aiSuggestions.summary && (
                      <div>
                        <h4 className="text-md font-medium">Suggested Summary</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                          {aiSuggestions.summary}
                        </p>
                      </div>
                    )}

                    {aiSuggestions.careerPaths && (
                      <div>
                        <h4 className="text-md font-medium">Career Path Suggestions</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {aiSuggestions.careerPaths.map((path, index) => (
                            <li key={index}>{path}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiSuggestions.skillsToAcquire && (
                      <div>
                        <h4 className="text-md font-medium">Skills to Acquire</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {aiSuggestions.skillsToAcquire.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiSuggestions.improvements && (
                      <div>
                        <h4 className="text-md font-medium">CV Improvements</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {aiSuggestions.improvements.map((improvement, index) => (
                            <li key={index}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => applyAISuggestions(setFieldValue)}
                      className="btn btn-secondary"
                    >
                      Apply AI Suggestions
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      Generate AI suggestions based on your CV information to improve your resume and get career advice.
                    </p>

                    <button
                      type="button"
                      onClick={() => generateAISuggestions(values)}
                      disabled={isGeneratingAI}
                      className="btn btn-primary flex items-center mx-auto"
                    >
                      {isGeneratingAI ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" /> Generating...
                        </>
                      ) : (
                        <>Generate AI Suggestions</>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={goToPreviousStep} className="btn btn-outline">
                  Previous: Projects
                </button>
                <button type="submit" disabled={isSubmitting || !isValid} className="btn btn-primary">
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Creating CV...
                    </>
                  ) : (
                    <>Create CV</>
                  )}
                </button>
              </div>
            </div>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default CVForm

