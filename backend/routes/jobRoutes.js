const express = require("express");
const router = express.Router();
const JobController = require("../controllers/jobController");
const { protect } = require("../middlewares/auth");

// Public routes
router.get("/", JobController.getJobs);
router.get("/:id", JobController.getJobById);

// Protected routes
router.get("/my/jobs", protect, JobController.getMyJobs);
router.get("/:id/applicants", protect, JobController.getJobApplicants);
router.post("/", protect, JobController.createJob);
router.put("/:id", protect, JobController.updateJob);
router.delete("/:id", protect, JobController.deleteJob);

module.exports = router;
