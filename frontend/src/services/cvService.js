import api from "./api";

// Upload CV data
export const uploadCV = async (formData) => {
  const response = await api.post("/cv/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get all CVs for current user
export const getUserCVs = async () => {
  const response = await api.get("/cv");
  return response.data;
};

// Get a single CV by ID
export const getCV = async (cvId) => {
  const response = await api.get(`/cv/${cvId}`);
  return response.data;
};

// Delete a CV
export const deleteCV = async (cvId) => {
  const response = await api.delete(`/cv/${cvId}`);
  return response.data;
};

// Update CV visibility
export const updateCVVisibility = async (cvId, visibility) => {
  const response = await api.patch(`/cv/${cvId}/visibility`, { visibility });
  return response.data;
};

// Get download URL for a CV (legacy method, kept for compatibility)
export const getCVDownloadUrl = (cvId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return `${api.defaults.baseURL}/cv/download/${cvId}?token=${user?.token}`;
};

// Export all functions as a default export as well
const cvService = {
  uploadCV,
  getUserCVs,
  getCV,
  deleteCV,
  updateCVVisibility,
  getCVDownloadUrl,
};

export default cvService;
