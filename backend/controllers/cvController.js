import { validationResult } from "express-validator"
import cvService from "../services/cvService.js"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a new CV
export const createCV = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    })
  }

  try {
    const userId = req.user.id
    const {
      title,
      template,
      personalInfo,
      education,
      experience,
      skills,
      projects,
      categories,
      aiSuggestions,
      isPublic = false,
    } = req.body

    // Create CV
    const result = await cvService.createCV(
      userId,
      title,
      template,
      personalInfo,
      education,
      experience,
      skills,
      projects,
      categories,
      aiSuggestions,
      isPublic,
    )

    res.status(201).json({
      success: true,
      message: "CV created successfully",
      cv: result,
    })
  } catch (error) {
    console.error("Create CV error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while creating CV",
    })
  }
}

// Get all CVs for current user
export const getUserCVs = async (req, res) => {
  try {
    const userId = req.user.id
    const cvs = await cvService.getCVsByUserId(userId)

    res.json({
      success: true,
      cvs,
    })
  } catch (error) {
    console.error("Get CVs error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching CVs",
    })
  }
}

// Get a specific CV by ID
export const getCVById = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    })
  }

  try {
    const userId = req.user.id
    const cvId = req.params.id
    const userRole = req.user.role

    const cv = await cvService.getCVById(cvId)

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      })
    }

    // Check if user is authorized to view this CV
    if (cv.user_id !== userId && userRole !== "hr" && !cv.is_public) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this CV",
      })
    }

    res.json({
      success: true,
      cv,
    })
  } catch (error) {
    console.error("Get CV error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching CV",
    })
  }
}

// Update a CV
export const updateCV = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    })
  }

  try {
    const userId = req.user.id
    const cvId = req.params.id
    const { title, template, isPublic, categories } = req.body

    // Check if CV exists and belongs to user
    const cv = await cvService.getCVByIdAndUserId(cvId, userId)

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found or you do not have permission to update it",
      })
    }

    // Update CV
    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (template !== undefined) updateData.template = template
    if (isPublic !== undefined) updateData.is_public = isPublic

    await cvService.updateCV(cvId, updateData, categories)

    res.json({
      success: true,
      message: "CV updated successfully",
    })
  } catch (error) {
    console.error("Update CV error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating CV",
    })
  }
}

// Delete a CV
export const deleteCV = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    })
  }

  try {
    const userId = req.user.id
    const cvId = req.params.id

    // Check if CV exists and belongs to user
    const cv = await cvService.getCVByIdAndUserId(cvId, userId)

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found or you do not have permission to delete it",
      })
    }

    // Delete PDF file if exists
    if (cv.pdf_url) {
      const pdfPath = path.join(__dirname, "..", cv.pdf_url)
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath)
      }
    }

    // Delete CV
    await cvService.deleteCV(cvId)

    res.json({
      success: true,
      message: "CV deleted successfully",
    })
  } catch (error) {
    console.error("Delete CV error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting CV",
    })
  }
}

// Get public CVs (for HR)
export const getPublicCVs = async (req, res) => {
  try {
    const { category, search } = req.query

    const cvs = await cvService.getPublicCVs(category, search)

    res.json({
      success: true,
      cvs,
    })
  } catch (error) {
    console.error("Get public CVs error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching public CVs",
    })
  }
}

export default {
  createCV,
  getUserCVs,
  getCVById,
  updateCV,
  deleteCV,
  getPublicCVs,
}

