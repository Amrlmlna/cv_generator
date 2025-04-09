const express = require("express");
const { upload } = require("../config/multer");
const { protect } = require("../middlewares/auth");
const {
  uploadCV,
  getUserCVs,
  getCV,
  downloadCV,
  deleteCV,
  updateCVVisibility,
} = require("../controllers/cvController");

const router = express.Router();

// Protect all routes
router.use(protect);

// Upload CV route - make file upload optional
router.post("/upload", upload.single("file"), uploadCV);

// Get all user CVs
router.get("/", getUserCVs);

// Get single CV
router.get("/:id", getCV);

// Download CV
router.get("/download/:id", downloadCV);

// Delete CV
router.delete("/:id", deleteCV);

// Update CV visibility
router.patch("/:id/visibility", updateCVVisibility);

module.exports = router;
