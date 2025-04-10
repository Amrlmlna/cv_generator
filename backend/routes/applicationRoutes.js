const express = require("express");
const router = express.Router();
const ApplicationController = require("../controllers/applicationController");
const { protect } = require("../middlewares/auth");

// Get all applications (admin only)
router.get("/", protect, ApplicationController.getApplications);

// Get my applications (for both job seekers and recruiters)
router.get("/me", protect, ApplicationController.getMyApplications);

// Get candidates (for recruiters)
router.get("/candidates", protect, ApplicationController.getCandidates);

// Get applications for a specific job
router.get("/job/:jobId", protect, ApplicationController.getApplicationsByJob);

// Get application by ID
router.get("/:id", protect, ApplicationController.getApplicationById);

// Create a new application
router.post("/", protect, ApplicationController.createApplication);

// Update application status
router.patch(
  "/:id/status",
  protect,
  ApplicationController.updateApplicationStatus
);

// Delete application
router.delete("/:id", protect, ApplicationController.deleteApplication);

module.exports = router;
