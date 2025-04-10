const ApplicationService = require("../services/applicationService");
const CVModel = require("../models/cvModel");

class ApplicationController {
  static async getApplications(req, res) {
    try {
      const applications = await ApplicationService.getAllApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error getting applications:", error);
      res.status(500).json({ message: "Failed to retrieve applications" });
    }
  }

  static async getApplicationById(req, res) {
    try {
      const application = await ApplicationService.getApplicationById(
        req.params.id
      );

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.error("Error getting application:", error);
      res.status(500).json({ message: "Failed to retrieve application" });
    }
  }

  static async getApplicationsByJob(req, res) {
    try {
      const applications = await ApplicationService.getApplicationsByJobId(
        req.params.jobId
      );
      res.json(applications);
    } catch (error) {
      console.error("Error getting applications by job:", error);
      res.status(500).json({ message: "Failed to retrieve applications" });
    }
  }

  static async getMyApplications(req, res) {
    try {
      // For job seekers - get their applications
      if (req.user.role === "jobSeeker") {
        const applications = await ApplicationService.getApplicationsByUserId(
          req.user.id
        );
        return res.json(applications);
      }

      // For recruiters - get applications for their jobs
      if (req.user.role === "recruiter") {
        const applications =
          await ApplicationService.getApplicationsByRecruiterId(req.user.id);
        return res.json(applications);
      }

      res.status(403).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error getting my applications:", error);
      res.status(500).json({ message: "Failed to retrieve applications" });
    }
  }

  static async createApplication(req, res) {
    try {
      // Only job seekers can apply
      if (req.user.role !== "jobSeeker") {
        return res
          .status(403)
          .json({ message: "Only job seekers can apply to jobs" });
      }

      // If no CV ID is provided, try to use the primary CV
      let cvId = req.body.cv_id;
      if (!cvId) {
        if (req.user.primary_cv_id) {
          cvId = req.user.primary_cv_id;
        } else {
          // Get the most recent CV
          const cvs = await CVModel.getByUserId(req.user.id);
          if (cvs.length > 0) {
            cvId = cvs[0].id;
          } else {
            return res
              .status(400)
              .json({
                message: "You need to create a CV before applying to jobs",
              });
          }
        }
      }

      const applicationData = {
        job_id: req.body.job_id,
        user_id: req.user.id,
        cv_id: cvId,
        cover_letter: req.body.cover_letter,
      };

      const newApplication = await ApplicationService.createApplication(
        applicationData
      );
      res.status(201).json(newApplication);
    } catch (error) {
      console.error("Error creating application:", error);
      res
        .status(500)
        .json({ message: error.message || "Failed to create application" });
    }
  }

  static async updateApplicationStatus(req, res) {
    try {
      // Only recruiters can update application status
      if (req.user.role !== "recruiter") {
        return res
          .status(403)
          .json({ message: "Only recruiters can update application status" });
      }

      const { id } = req.params;
      const { status } = req.body;

      const updatedApplication =
        await ApplicationService.updateApplicationStatus(id, status);
      res.json(updatedApplication);
    } catch (error) {
      console.error("Error updating application status:", error);
      res
        .status(500)
        .json({
          message: error.message || "Failed to update application status",
        });
    }
  }

  static async deleteApplication(req, res) {
    try {
      await ApplicationService.deleteApplication(req.params.id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  }

  static async getCandidates(req, res) {
    try {
      // Only recruiters can view candidates
      if (req.user.role !== "recruiter") {
        return res
          .status(403)
          .json({ message: "Only recruiters can view candidates" });
      }

      const candidates = await ApplicationService.getCandidatesByRecruiterId(
        req.user.id
      );
      res.json(candidates);
    } catch (error) {
      console.error("Error getting candidates:", error);
      res.status(500).json({ message: "Failed to retrieve candidates" });
    }
  }
}

module.exports = ApplicationController;
