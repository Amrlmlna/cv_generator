const fs = require("fs")
const path = require("path")
const { query } = require("../config/db")

/**
 * Save CV to database
 */
const saveCV = async (userId, title, imagePath) => {
  // Insert CV record into database
  const result = await query("INSERT INTO cvs (user_id, title, image_path) VALUES (?, ?, ?)", [
    userId,
    title,
    imagePath,
  ])

  // Get the newly created CV
  const newCV = await query("SELECT * FROM cvs WHERE id = ?", [result.insertId])

  return newCV[0]
}

/**
 * Get all CVs for a user
 */
const getUserCVs = async (userId) => {
  const cvs = await query("SELECT * FROM cvs WHERE user_id = ? ORDER BY created_at DESC", [userId])

  return cvs
}

/**
 * Get a single CV by ID
 */
const getCVById = async (cvId, userId) => {
  const cvs = await query("SELECT * FROM cvs WHERE id = ? AND user_id = ?", [cvId, userId])

  if (cvs.length === 0) {
    const error = new Error("CV not found or not authorized")
    error.statusCode = 404
    throw error
  }

  return cvs[0]
}

/**
 * Delete a CV by ID
 */
const deleteCV = async (cvId, userId) => {
  // Get CV to check if it exists and belongs to user
  const cvs = await query("SELECT * FROM cvs WHERE id = ? AND user_id = ?", [cvId, userId])

  if (cvs.length === 0) {
    const error = new Error("CV not found or not authorized")
    error.statusCode = 404
    throw error
  }

  const cv = cvs[0]

  // Delete the file from the filesystem
  const filePath = path.join(__dirname, "..", cv.image_path)

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    // Continue with database deletion even if file deletion fails
  }

  // Delete the CV record from the database
  await query("DELETE FROM cvs WHERE id = ?", [cvId])

  return { message: "CV deleted successfully" }
}

module.exports = {
  saveCV,
  getUserCVs,
  getCVById,
  deleteCV,
}

