"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)

        // Check if token is expired
        const currentTime = Date.now() / 1000
        if (decodedToken.exp < currentTime) {
          // Token is expired
          logout()
        } else {
          // Set user data from token
          setUser({
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role,
          })
          setIsAuthenticated(true)

          // Set default Authorization header for all requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        }
      } catch (error) {
        console.error("Invalid token:", error)
        logout()
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password })

      if (response.data.success) {
        const { token, user } = response.data

        // Save token to localStorage
        localStorage.setItem("token", token)

        // Set user data
        setUser(user)
        setIsAuthenticated(true)

        // Set default Authorization header for all requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        toast.success("Login successful!")
        return true
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Login failed. Please try again.")
      return false
    }
  }

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post("/api/auth/register", { name, email, password, role })

      if (response.data.success) {
        const { token, user } = response.data

        // Save token to localStorage
        localStorage.setItem("token", token)

        // Set user data
        setUser(user)
        setIsAuthenticated(true)

        // Set default Authorization header for all requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        toast.success("Registration successful!")
        return true
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.response?.data?.message || "Registration failed. Please try again.")
      return false
    }
  }

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token")

    // Clear user data
    setUser(null)
    setIsAuthenticated(false)

    // Remove Authorization header
    delete axios.defaults.headers.common["Authorization"]

    toast.info("You have been logged out.")
  }

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put("/api/users/profile", userData)

      if (response.data.success) {
        // Update user data
        setUser({
          ...user,
          ...response.data.user,
        })

        toast.success("Profile updated successfully!")
        return true
      }
    } catch (error) {
      console.error("Update profile error:", error)
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.")
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

