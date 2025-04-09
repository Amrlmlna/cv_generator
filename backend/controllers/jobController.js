const jobService = require("../services/jobService");

const getJobs = async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve jobs" });
  }
};

const createJob = async (req, res) => {
  try {
    // Tambahkan recruiter_id dari token user yang sudah di-attach via middleware
    const jobData = {
      ...req.body,
      recruiter_id: req.user.id,
    };

    const newJob = await jobService.createJob(jobData);
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Failed to create job:", error); // bantu debugging
    res.status(500).json({ message: "Failed to create job" });
  }
};

const updateJob = async (req, res) => {
  try {
    const updated = await jobService.updateJob(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    await jobService.deleteJob(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};
module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};
