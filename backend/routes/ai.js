import express from "express"
import { body, validationResult } from "express-validator"
import { verifyToken, isUser } from "../middleware/auth.js"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Generate CV suggestions
router.post(
  "/generate-suggestions",
  verifyToken,
  isUser,
  [
    body("personalInfo").notEmpty().withMessage("Personal information is required"),
    body("personalInfo.full_name").notEmpty().withMessage("Full name is required"),
    body("personalInfo.summary").optional(),
    body("education").isArray().withMessage("Education must be an array"),
    body("experience").isArray().withMessage("Experience must be an array"),
    body("skills").isArray().withMessage("Skills must be an array"),
    body("projects").isArray().optional(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    try {
      const { personalInfo, education, experience, skills, projects } = req.body

      // Prepare data for AI prompt
      const educationText = education
        .map(
          (edu) =>
            `- ${edu.degree} in ${edu.field_of_study || "N/A"} from ${edu.institution} (${edu.start_date || "N/A"} - ${edu.end_date || "N/A"})`,
        )
        .join("\n")

      const experienceText = experience
        .map(
          (exp) =>
            `- ${exp.position} at ${exp.company} (${exp.start_date || "N/A"} - ${exp.is_current ? "Present" : exp.end_date || "N/A"})\n  ${exp.description || "No description provided."}`,
        )
        .join("\n")

      const skillsText = skills.map((skill) => `- ${skill.name} (${skill.proficiency || "intermediate"})`).join("\n")

      const projectsText = projects
        ? projects
            .map((project) => `- ${project.name}: ${project.description || "No description provided."}`)
            .join("\n")
        : "No projects provided."

      // Create prompt for AI
      const prompt = `
        I need help creating a professional CV and career suggestions for a person with the following background:
        
        Name: ${personalInfo.full_name}
        
        Summary: ${personalInfo.summary || "No summary provided."}
        
        Education:
        ${educationText || "No education provided."}
        
        Experience:
        ${experienceText || "No experience provided."}
        
        Skills:
        ${skillsText || "No skills provided."}
        
        Projects:
        ${projectsText}
        
        Please provide:
        1. A professional summary for their CV (2-3 sentences)
        2. 3-5 career path suggestions based on their background
        3. 3-5 skills they should develop to enhance their career prospects
        4. Any improvements to make their CV stand out
        
        Format the response in JSON with the following structure:
        {
          "summary": "Professional summary here",
          "careerPaths": ["Career 1", "Career 2", ...],
          "skillsToAcquire": ["Skill 1", "Skill 2", ...],
          "improvements": ["Improvement 1", "Improvement 2", ...]
        }
      `

      // Call Google Generative AI
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parse JSON from response
      let suggestions
      try {
        // Extract JSON from the response (it might be wrapped in markdown code blocks)
        const jsonMatch =
          text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*?}/)
        const jsonString = jsonMatch ? jsonMatch[0] : text
        suggestions = JSON.parse(jsonString.replace(/```json\n|```\n|```/g, ""))
      } catch (error) {
        console.error("Error parsing AI response:", error)
        // If parsing fails, return the raw text
        suggestions = { rawResponse: text }
      }

      res.json({
        success: true,
        suggestions,
      })
    } catch (error) {
      console.error("AI generation error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while generating AI suggestions",
      })
    }
  },
)

export default router

