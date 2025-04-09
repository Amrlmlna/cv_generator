const path = require("path")
const fs = require("fs")
const { asyncHandler } = require("../middlewares/errorHandler")
const cvService = require("../services/cvService")

/**
 * @desc    Upload a CV screenshot
 * @route   POST /api/cv/upload
 * @access  Private
 */
const uploadCV = asyncHandler(async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a file",
    })
  }

  // Get title from request body
  const { title } = req.body

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Please provide a title for the CV",
    })
  }

  // Get file path
  const filePath = path.join(process.env.UPLOAD_PATH || "uploads", req.file.filename)

  // Save CV to database
  const cv = await cvService.saveCV(req.user.id, title, filePath)

  res.status(201).json({
    success: true,
    data: cv,
  })
})

/**
 * @desc    Get all CVs for a user
 * @route   GET /api/cv
 * @access  Private
 */
const getUserCVs = asyncHandler(async (req, res) => {
  const cvs = await cvService.getUserCVs(req.user.id)

  // Add full URL to image paths
  const cvsWithUrls = cvs.map((cv) => ({
    ...cv,
    image_url: `${req.protocol}://${req.get("host")}/${cv.image_path}`,
  }))

  res.status(200).json({
    success: true,
    count: cvsWithUrls.length,
    data: cvsWithUrls,
  })
})

/**
 * @desc    Get a single CV
 * @route   GET /api/cv/:id
 * @access  Private
 */
const getCV = asyncHandler(async (req, res) => {
  const cv = await cvService.getCVById(req.params.id, req.user.id)

  // Add full URL to image path
  cv.image_url = `${req.protocol}://${req.get("host")}/${cv.image_path}`

  res.status(200).json({
    success: true,
    data: cv,
  })
})

/**
 * @desc    Download a CV
 * @route   GET /api/cv/download/:id
 * @access  Private
 */
const downloadCV = asyncHandler(async (req, res) => {
  const cv = await cvService.getCVById(req.params.id, req.user.id)

  const filePath = path.join(__dirname, "..", cv.image_path)

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "CV file not found",
    })
  }

  // Set content disposition header for download
  res.setHeader("Content-Disposition", `attachment; filename=${path.basename(filePath)}`)

  // Send file
  res.sendFile(filePath)
})

/**
 * @desc    Delete a CV
 * @route   DELETE /api/cv/:id
 * @access  Private
 */
const deleteCV = asyncHandler(async (req, res) => {
  await cvService.deleteCV(req.params.id, req.user.id)

  res.status(200).json({
    success: true,
    message: "CV deleted successfully",
  })
})

module.exports = {
  uploadCV,
  getUserCVs,
  getCV,
  downloadCV,
  deleteCV,
}

