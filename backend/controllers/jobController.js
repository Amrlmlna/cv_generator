const JobService = require("../services/jobService");
const ApplicationService = require("../services/applicationService");

class JobController {
  static async getJobs(req, res) {
    try {
      const jobs = await JobService.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error getting jobs:", error);
      res.status(500).json({ message: "Failed to retrieve jobs" });
    }
  }

  static async getJobById(req, res) {
    try {
      const job = await JobService.getJobById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Error getting job:", error);
      res.status(500).json({ message: "Failed to retrieve job" });
    }
  }

  static async getMyJobs(req, res) {
    try {
      // Only recruiters can view their jobs
      if (req.user.role !== "recruiter") {
        return res
          .status(403)
          .json({ message: "Only recruiters can view their jobs" });
      }

      const jobs = await JobService.getJobsByRecruiterId(req.user.id);
      res.json(jobs);
    } catch (error) {
      console.error("Error getting my jobs:", error);
      res.status(500).json({ message: "Failed to retrieve jobs" });
    }
  }

  static async createJob(req, res) {
    try {
      // Only recruiters can create jobs
      if (req.user.role !== "recruiter") {
        return res
          .status(403)
          .json({ message: "Only recruiters can create jobs" });
      }

      const jobData = {
        ...req.body,
        recruiter_id: req.user.id,
      };

      const newJob = await JobService.createJob(jobData);
      res.status(201).json(newJob);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  }

  static async updateJob(req, res) {
    try {
      // Only recruiters can update jobs
      if (req.user.role !== "recruiter") {
        return res
          .status(403)
          .json({ message: "Only recruiters can update jobs" });
      }

      // Verify the job belongs to this recruiter
      const job = await JobService.getJobById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.recruiter_id !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only update your own jobs" });
      }

      const updatedJob = await JobService.updateJob(req.params.id, req.body);
      res.json(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  }

  static async deleteJob(req, res) {
    try {
      // Only recruiters can delete jobs
      if (req.user.role !== "recruiter") {
        return res
          .status(403)
          .json({ message: "Only recruiters can delete jobs" });
      }

      // Verify the job belongs to this recruiter
      const job = await JobService.getJobById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.recruiter_id !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only delete your own jobs" });
      }

      await JobService.deleteJob(req.params.id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  }

  static async getJobApplicants(req, res) {
    try {
      // Only recruiters can view applicants
      if (req.user.role !== "recruiter") {
        return res
          .status(403)
          .json({ message: "Only recruiters can view applicants" });
      }

      // Verify the job belongs to this recruiter
      const job = await JobService.getJobById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.recruiter_id !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only view applicants for your own jobs" });
      }

      const applicants = await ApplicationService.getApplicationsByJobId(
        req.params.id
      );
      res.json(applicants);
    } catch (error) {
      console.error("Error getting job applicants:", error);
      res.status(500).json({ message: "Failed to retrieve applicants" });
    }
  }
}

module.exports = JobController;
