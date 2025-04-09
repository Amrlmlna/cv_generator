const express = require("express")
const { upload } = require("../config/multer")
const { protect } = require("../middlewares/auth")
const { uploadCV, getUserCVs, getCV, downloadCV, deleteCV } = require("../controllers/cvController")

const router = express.Router()

// Protect all routes
router.use(protect)

// Upload CV route
router.post("/upload", upload.single("image"), uploadCV)

// Get all user CVs
router.get("/", getUserCVs)

// Get single CV
router.get("/:id", getCV)

// Download CV
router.get("/download/:id", downloadCV)

// Delete CV
router.delete("/:id", deleteCV)

module.exports = router

