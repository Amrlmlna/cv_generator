const ApplicationModel = require("../models/applicationModel");
const JobModel = require("../models/jobModel");
const CVModel = require("../models/cvModel");

class ApplicationService {
  static async getAllApplications() {
    return await ApplicationModel.getAll();
  }

  static async getApplicationById(id) {
    return await ApplicationModel.getById(id);
  }

  static async getApplicationsByJobId(jobId) {
    return await ApplicationModel.getByJobId(jobId);
  }

  static async getApplicationsByRecruiterId(recruiterId) {
    return await ApplicationModel.getByRecruiterId(recruiterId);
  }

  static async getApplicationsByUserId(userId) {
    return await ApplicationModel.getByUserId(userId);
  }

  static async createApplication(data) {
    // Check if job exists and is active
    const job = await JobModel.getById(data.job_id);
    if (!job) {
      throw new Error("Job not found");
    }

    if (job.status !== "Active") {
      throw new Error("Cannot apply to inactive job");
    }

    // Check if CV exists and belongs to the user
    const cv = await CVModel.getById(data.cv_id);
    if (!cv) {
      throw new Error("CV not found");
    }

    if (cv.user_id !== data.user_id) {
      throw new Error("CV does not belong to this user");
    }

    // Check if user already applied to this job
    const hasApplied = await ApplicationModel.checkExistingApplication(
      data.user_id,
      data.job_id
    );
    if (hasApplied) {
      throw new Error("You have already applied to this job");
    }

    return await ApplicationModel.create(data);
  }

  static async updateApplicationStatus(id, status) {
    const validStatuses = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Offered",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error("Invalid application status");
    }

    return await ApplicationModel.updateStatus(id, status);
  }

  static async deleteApplication(id) {
    return await ApplicationModel.delete(id);
  }

  static async getCandidatesByRecruiterId(recruiterId) {
    const applications = await ApplicationModel.getByRecruiterId(recruiterId);

    // Transform the data to match the expected format in the Candidates component
    return applications.map((app) => {
      // Parse CV data from JSON string
      const cvData =
        typeof app.cv_data === "string" ? JSON.parse(app.cv_data) : app.cv_data;

      return {
        id: app.id,
        name: app.name,
        title: cvData?.personalInfo?.title || "Job Seeker",
        location: cvData?.personalInfo?.location || "Not specified",
        skills: cvData?.skills || [],
        experience: this._formatExperience(cvData?.experience),
        education: this._formatEducation(cvData?.education),
        status: app.status,
        appliedDate: app.applied_date,
        jobTitle: app.job_title,
        company: app.company,
        email: app.email,
        cv_id: app.cv_id,
      };
    });
  }

  // Helper method to format experience for display
  static _formatExperience(experience) {
    if (!experience || !Array.isArray(experience) || experience.length === 0) {
      return "No experience";
    }

    // Get the most recent experience
    const mostRecent = experience.sort((a, b) => {
      return new Date(b.startDate) - new Date(a.startDate);
    })[0];

    return `${mostRecent.position} at ${mostRecent.company}`;
  }

  // Helper method to format education for display
  static _formatEducation(education) {
    if (!education || !Array.isArray(education) || education.length === 0) {
      return "No education listed";
    }

    // Get the highest education
    const highest = education.sort((a, b) => {
      const degreeOrder = {
        PhD: 5,
        Doctorate: 5,
        Master: 4,
        "Master's": 4,
        Bachelor: 3,
        "Bachelor's": 3,
        Associate: 2,
        "Associate's": 2,
        "High School": 1,
      };

      return (degreeOrder[b.degree] || 0) - (degreeOrder[a.degree] || 0);
    })[0];

    return `${highest.degree} in ${highest.field}`;
  }
}

module.exports = ApplicationService;
