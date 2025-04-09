const fs = require("fs");
const path = require("path");
const { query } = require("../config/db");

/**
 * Save CV to database
 */
const saveCV = async (
  userId,
  title,
  filePath,
  visibility = "private",
  cvData
) => {
  // Insert CV record into database
  const result = await query(
    "INSERT INTO cvs (user_id, title, file_path, visibility, cv_data) VALUES (?, ?, ?, ?, ?)",
    [userId, title, filePath, visibility, cvData]
  );

  // Get the newly created CV
  const newCV = await query("SELECT * FROM cvs WHERE id = ?", [
    result.insertId,
  ]);

  return newCV[0];
};

/**
 * Get all CVs for a user
 */
const getUserCVs = async (userId) => {
  const cvs = await query(
    "SELECT id, user_id, title, file_path, visibility, created_at, updated_at FROM cvs WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  return cvs;
};

/**
 * Get a single CV by ID
 */
const getCVById = async (cvId, userId) => {
  const cvs = await query("SELECT * FROM cvs WHERE id = ? AND user_id = ?", [
    cvId,
    userId,
  ]);

  if (cvs.length === 0) {
    const error = new Error("CV not found or not authorized");
    error.statusCode = 404;
    throw error;
  }

  return cvs[0];
};

/**
 * Delete a CV by ID
 */
const deleteCV = async (cvId, userId) => {
  // Get CV to check if it exists and belongs to user
  const cvs = await query("SELECT * FROM cvs WHERE id = ? AND user_id = ?", [
    cvId,
    userId,
  ]);

  if (cvs.length === 0) {
    const error = new Error("CV not found or not authorized");
    error.statusCode = 404;
    throw error;
  }

  const cv = cvs[0];

  // Delete the file from the filesystem if it exists
  if (cv.file_path) {
    const filePath = path.join(__dirname, "..", cv.file_path);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      // Continue with database deletion even if file deletion fails
    }
  }

  // Delete the CV record from the database
  await query("DELETE FROM cvs WHERE id = ?", [cvId]);

  return { message: "CV deleted successfully" };
};

/**
 * Update CV visibility
 */
const updateCVVisibility = async (cvId, userId, visibility) => {
  // Check if CV exists and belongs to user
  const cvs = await query("SELECT * FROM cvs WHERE id = ? AND user_id = ?", [
    cvId,
    userId,
  ]);

  if (cvs.length === 0) {
    const error = new Error("CV not found or not authorized");
    error.statusCode = 404;
    throw error;
  }

  // Update visibility
  await query("UPDATE cvs SET visibility = ? WHERE id = ?", [visibility, cvId]);

  return { message: "CV visibility updated successfully" };
};

module.exports = {
  saveCV,
  getUserCVs,
  getCVById,
  deleteCV,
  updateCVVisibility,
};
