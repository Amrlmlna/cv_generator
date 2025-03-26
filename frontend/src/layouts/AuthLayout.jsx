"use client"

import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { FaSun, FaMoon } from "react-icons/fa"

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const { darkMode, toggleTheme } = useTheme()

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        aria-label="Toggle theme"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Logo */}
      <div className="flex justify-center mt-8">
        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">AI CV Generator</div>
      </div>

      {/* Auth form container */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} AI CV Generator. All rights reserved.
      </footer>
    </div>
  )
}

export default AuthLayout

