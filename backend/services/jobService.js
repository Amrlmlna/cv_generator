const JobModel = require("../models/jobModel");

class JobService {
  static async getAllJobs() {
    return await JobModel.getAll();
  }

  static async getJobById(id) {
    return await JobModel.getById(id);
  }

  static async getJobsByRecruiterId(recruiterId) {
    return await JobModel.getByRecruiterId(recruiterId);
  }

  static async createJob(data) {
    // Validate required fields
    const requiredFields = [
      "title",
      "company",
      "location",
      "description",
      "requirements",
      "type",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }

    return await JobModel.create(data);
  }

  static async updateJob(id, data) {
    // Get the existing job to merge with updates
    const existingJob = await JobModel.getById(id);

    if (!existingJob) {
      throw new Error("Job not found");
    }

    // Merge existing data with updates
    const updatedData = { ...existingJob, ...data };

    return await JobModel.update(id, updatedData);
  }

  static async deleteJob(id) {
    return await JobModel.delete(id);
  }
}

module.exports = JobService;
