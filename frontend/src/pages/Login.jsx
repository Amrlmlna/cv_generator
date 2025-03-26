"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { FaSpinner } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState("")

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  }

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError("")

    try {
      const success = await login(values.email, values.password)

      if (success) {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>

      {loginError && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4">
          {loginError}
        </div>
      )}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field type="email" id="email" name="email" className="form-input" placeholder="Enter your email" />
              <ErrorMessage name="email" component="div" className="form-error" />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="form-error" />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">
                Register
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Login

