const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { asyncHandler } = require("../middlewares/errorHandler");
const cvService = require("../services/cvService");

/**
 * @desc    Upload CV data and save PDF
 * @route   POST /api/cv/upload
 * @access  Private
 */
const uploadCV = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  // Get data from request body
  const { title, visibility, cvData } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Please provide a title for the CV",
    });
  }

  // Define the upload directory
  const uploadDir = process.env.UPLOAD_PATH || "uploads";

  // Create the directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let filePath = null;

  // If a file was uploaded, save it
  if (req.file) {
    filePath = path.join(uploadDir, req.file.filename);
  } else {
    // No file was uploaded, create a placeholder or generate a PDF
    // For now, we'll just set filePath to null
    filePath = null;
  }

  // Save CV to database
  const cv = await cvService.saveCV(
    req.user.id,
    title,
    filePath,
    visibility || "private",
    cvData
  );

  res.status(201).json({
    success: true,
    data: cv,
  });
});

/**
 * @desc    Get all CVs for a user
 * @route   GET /api/cv
 * @access  Private
 */
const getUserCVs = asyncHandler(async (req, res) => {
  const cvs = await cvService.getUserCVs(req.user.id);

  // Add full URL to file paths if they exist
  const cvsWithUrls = cvs.map((cv) => ({
    ...cv,
    file_url: cv.file_path
      ? `${req.protocol}://${req.get("host")}/${cv.file_path}`
      : null,
  }));

  res.status(200).json({
    success: true,
    count: cvsWithUrls.length,
    data: cvsWithUrls,
  });
});

/**
 * @desc    Get a single CV
 * @route   GET /api/cv/:id
 * @access  Private
 */
const getCV = asyncHandler(async (req, res) => {
  const cv = await cvService.getCVById(req.params.id, req.user.id);

  // Add full URL to file path if it exists
  if (cv.file_path) {
    cv.file_url = `${req.protocol}://${req.get("host")}/${cv.file_path}`;
  } else {
    cv.file_url = null;
  }

  res.status(200).json({
    success: true,
    data: cv,
  });
});

/**
 * @desc    Download a CV
 * @route   GET /api/cv/download/:id
 * @access  Private
 */
const downloadCV = asyncHandler(async (req, res) => {
  const cv = await cvService.getCVById(req.params.id, req.user.id);

  if (!cv.file_path) {
    return res.status(404).json({
      success: false,
      message: "CV file not found",
    });
  }

  const filePath = path.join(__dirname, "..", cv.file_path);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "CV file not found",
    });
  }

  // Set content disposition header for download
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${path.basename(filePath)}`
  );

  // Send file
  res.sendFile(filePath);
});

/**
 * @desc    Delete a CV
 * @route   DELETE /api/cv/:id
 * @access  Private
 */
const deleteCV = asyncHandler(async (req, res) => {
  await cvService.deleteCV(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "CV deleted successfully",
  });
});

/**
 * @desc    Update CV visibility
 * @route   PATCH /api/cv/:id/visibility
 * @access  Private
 */
const updateCVVisibility = asyncHandler(async (req, res) => {
  const { visibility } = req.body;

  if (!visibility || !["public", "private"].includes(visibility)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid visibility value (public or private)",
    });
  }

  await cvService.updateCVVisibility(req.params.id, req.user.id, visibility);

  res.status(200).json({
    success: true,
    message: "CV visibility updated successfully",
  });
});

module.exports = {
  uploadCV,
  getUserCVs,
  getCV,
  downloadCV,
  deleteCV,
  updateCVVisibility,
};
