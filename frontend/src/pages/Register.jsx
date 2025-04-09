"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("jobSeeker")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    setIsLoading(true)

    try {
      await register({
        name,
        email,
        password,
        role,
      })
      navigate("/")
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create an account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 text-white p-3 rounded-lg text-xl font-bold">CV</div>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900">Create an account</h1>
          <p className="text-secondary-600 mt-2">Start building your career with CareerForge</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-card">
          {error && <div className="mb-4 p-3 bg-danger-50 text-danger-700 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="form-label">Account Type</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  className={`p-3 border rounded-md text-center transition-colors ${
                    role === "jobSeeker"
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-secondary-300 hover:border-secondary-400"
                  }`}
                  onClick={() => setRole("jobSeeker")}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  className={`p-3 border rounded-md text-center transition-colors ${
                    role === "recruiter"
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-secondary-300 hover:border-secondary-400"
                  }`}
                  onClick={() => setRole("recruiter")}
                >
                  Recruiter
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

