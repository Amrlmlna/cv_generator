"use client"

import { useState } from "react"
import useCareerPath from "../store/careerPathStore"
import { Compass, ArrowRight } from "lucide-react"

const CareerPathGenerator = () => {
  const { formData, setFormData, careerPathResult, isLoading, setIsLoading, setCareerPathResult, resetForm } =
    useCareerPath()

  const [currentSkill, setCurrentSkill] = useState("")
  const [currentInterest, setCurrentInterest] = useState("")

  // Handle text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ [name]: value })
  }

  // Handle skills
  const handleAddSkill = () => {
    if (!currentSkill.trim()) return

    setFormData({
      currentSkills: [...formData.currentSkills, currentSkill.trim()],
    })
    setCurrentSkill("")
  }

  const handleRemoveSkill = (index) => {
    const updatedSkills = formData.currentSkills.filter((_, i) => i !== index)
    setFormData({ currentSkills: updatedSkills })
  }

  // Handle interests
  const handleAddInterest = () => {
    if (!currentInterest.trim()) return

    setFormData({
      interests: [...formData.interests, currentInterest.trim()],
    })
    setCurrentInterest("")
  }

  const handleRemoveInterest = (index) => {
    const updatedInterests = formData.interests.filter((_, i) => i !== index)
    setFormData({ interests: updatedInterests })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (
      formData.currentSkills.length === 0 ||
      formData.interests.length === 0 ||
      !formData.education ||
      !formData.experience ||
      !formData.goals
    ) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, this would call the Gemini API
      // For now, let's simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response
      const mockResult = {
        careerPath: {
          title: "Full Stack Developer to Technical Lead",
          description:
            "Based on your background in web development and interest in leadership, this career path will take you from a hands-on developer role to a technical leadership position.",
          steps: [
            {
              role: "Mid-level Full Stack Developer",
              timeframe: "1-2 years",
              focus: "Strengthen your full stack skills, focusing on modern frameworks and cloud technologies.",
              skills: ["React", "Node.js", "AWS/Azure", "CI/CD", "Test-driven development"],
            },
            {
              role: "Senior Developer",
              timeframe: "2-3 years",
              focus: "Take on more complex projects and begin mentoring junior developers.",
              skills: ["System design", "Team leadership", "Code review", "Architectural patterns"],
            },
            {
              role: "Lead Developer",
              timeframe: "2-3 years",
              focus: "Lead a team of developers, make key technical decisions, and work closely with product managers.",
              skills: ["Team management", "Technical planning", "Project estimation", "Stakeholder communication"],
            },
            {
              role: "Technical Lead / Engineering Manager",
              timeframe: "3+ years",
              focus:
                "Oversee multiple teams or projects, shape technical direction, and contribute to organizational strategy.",
              skills: [
                "Strategic planning",
                "Cross-team collaboration",
                "Technical vision",
                "Hiring and team building",
              ],
            },
          ],
          suggestions: [
            "Pursue certifications in cloud platforms like AWS or Azure",
            "Contribute to open-source projects to build visibility",
            "Speak at technical conferences or meetups",
            "Take courses on engineering management and leadership",
            "Build a network with other technical leaders in your industry",
          ],
        },
        alternativePaths: [
          "DevOps Engineer → Platform Engineer → DevOps Architect",
          "Full Stack Developer → Solutions Architect → Enterprise Architect",
          "Full Stack Developer → Product Manager → Director of Product",
        ],
      }

      setCareerPathResult(mockResult)
    } catch (error) {
      console.error("Error generating career path:", error)
      alert("Failed to generate career path. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Career Path Generator</h1>
        <p className="text-secondary-600">Get AI-powered career guidance based on your skills, experience, and goals</p>
      </div>

      {!careerPathResult ? (
        <div className="bg-white rounded-lg shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skills */}
            <div>
              <label htmlFor="currentSkill" className="form-label">
                Current Skills
              </label>
              <div className="flex gap-2">
                <input
                  id="currentSkill"
                  type="text"
                  className="input flex-1"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add your technical and soft skills"
                />
                <button type="button" onClick={handleAddSkill} className="btn btn-primary whitespace-nowrap">
                  Add Skill
                </button>
              </div>

              {formData.currentSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.currentSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-primary-700 hover:text-primary-900"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interests */}
            <div>
              <label htmlFor="interest" className="form-label">
                Professional Interests
              </label>
              <div className="flex gap-2">
                <input
                  id="interest"
                  type="text"
                  className="input flex-1"
                  value={currentInterest}
                  onChange={(e) => setCurrentInterest(e.target.value)}
                  placeholder="Add areas you're interested in exploring"
                />
                <button type="button" onClick={handleAddInterest} className="btn btn-primary whitespace-nowrap">
                  Add Interest
                </button>
              </div>

              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.interests.map((interest, index) => (
                    <div
                      key={index}
                      className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(index)}
                        className="text-primary-700 hover:text-primary-900"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div>
              <label htmlFor="education" className="form-label">
                Educational Background
              </label>
              <textarea
                id="education"
                name="education"
                className="input"
                rows="3"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="Describe your education, including degrees, fields of study, and any relevant certifications"
                required
              ></textarea>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="form-label">
                Professional Experience
              </label>
              <textarea
                id="experience"
                name="experience"
                className="input"
                rows="3"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Summarize your work experience, including roles, companies, and key responsibilities"
                required
              ></textarea>
            </div>

            {/* Goals */}
            <div>
              <label htmlFor="goals" className="form-label">
                Career Goals
              </label>
              <textarea
                id="goals"
                name="goals"
                className="input"
                rows="3"
                value={formData.goals}
                onChange={handleInputChange}
                placeholder="Describe your short-term and long-term career goals. What would you like to achieve?"
                required
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Career Path"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Result header */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <div className="bg-primary-100 p-3 rounded-lg mr-4">
                  <Compass className="text-primary-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">{careerPathResult.careerPath.title}</h2>
                  <p className="text-secondary-600 mt-1">Your personalized career path based on your profile</p>
                </div>
              </div>
              <button onClick={() => setCareerPathResult(null)} className="btn btn-outline">
                Generate Another Path
              </button>
            </div>
          </div>

          {/* Career Path Overview */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold mb-4">Overview</h3>
            <p className="text-secondary-700">{careerPathResult.careerPath.description}</p>
          </div>

          {/* Career Path Steps */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Career Path</h3>

            <div className="space-y-6">
              {careerPathResult.careerPath.steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Timeline connector */}
                  {index < careerPathResult.careerPath.steps.length - 1 && (
                    <div className="absolute top-12 bottom-0 left-6 w-0.5 bg-primary-200"></div>
                  )}

                  <div className="flex">
                    <div className="flex-shrink-0 mt-2">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold border-2 border-primary-200 z-10">
                        {index + 1}
                      </div>
                    </div>

                    <div className="ml-6">
                      <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h4 className="font-bold text-secondary-900">{step.role}</h4>
                          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                            {step.timeframe}
                          </span>
                        </div>

                        <p className="text-secondary-700 mb-4">{step.focus}</p>

                        <div>
                          <h5 className="text-sm font-semibold text-secondary-900 mb-2">Key Skills to Develop:</h5>
                          <div className="flex flex-wrap gap-2">
                            {step.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {careerPathResult.careerPath.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="text-primary-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-secondary-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Alternative Paths */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold mb-4">Alternative Career Paths</h3>
            <ul className="space-y-3">
              {careerPathResult.alternativePaths.map((path, index) => (
                <li key={index} className="bg-secondary-50 p-3 rounded-md border border-secondary-200">
                  {path}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default CareerPathGenerator

