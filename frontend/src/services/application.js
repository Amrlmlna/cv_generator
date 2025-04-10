import api from "./api";

const applicationService = {
  // Get my applications (for both job seekers and recruiters)
  getMyApplications: async () => {
    const response = await api.get("/applications/me");
    return response.data;
  },

  // Get candidates (for recruiters)
  getCandidates: async () => {
    const response = await api.get("/applications/candidates");
    return response.data;
  },

  // Apply to job (for job seekers)
  applyToJob: async (applicationData) => {
    const response = await api.post("/applications", applicationData);
    return response.data;
  },

  // Update application status (for recruiters)
  updateApplicationStatus: async (id, status) => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
  },

  // Withdraw application (for job seekers)
  withdrawApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};

export default applicationService;
