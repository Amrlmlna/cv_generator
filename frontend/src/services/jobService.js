// services/jobService.js
import api from "./api";

// Ambil semua job listing
export const getJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};

// Buat job listing baru
export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);
  return response.data;
};

// Update job berdasarkan ID
export const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Hapus job berdasarkan ID
export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

// Export semua fungsi
const jobService = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};

export default jobService;
