import api from "./api"

// Register a new user
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.data))
  }
  return response.data
}

// Login user
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials)
  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.data))
  }
  return response.data
}

// Logout user
export const logout = () => {
  localStorage.removeItem("user")
}

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me")
  return response.data
}

