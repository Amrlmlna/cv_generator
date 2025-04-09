"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { login as loginApi, register as registerApi, logout as logoutApi } from "../services/authService"

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    setError(null)
    try {
      const response = await loginApi(credentials)
      setCurrentUser(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
      throw err
    }
  }

  const register = async (userData) => {
    setError(null)
    try {
      const response = await registerApi(userData)
      setCurrentUser(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
      throw err
    }
  }

  const logout = () => {
    logoutApi()
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    isJobSeeker: currentUser?.role === "jobSeeker",
    isRecruiter: currentUser?.role === "recruiter",
    login,
    logout,
    register,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

