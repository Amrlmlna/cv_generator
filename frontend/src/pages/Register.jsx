"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { FaSpinner } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  role: Yup.string().oneOf(["user", "hr"], "Invalid role").required("Role is required"),
})

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [registerError, setRegisterError] = useState("")

  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  }

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setRegisterError("")

    try {
      const success = await register(values.name, values.email, values.password, values.role)

      if (success) {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setRegisterError("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>

      {registerError && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4">
          {registerError}
        </div>
      )}

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <Field type="text" id="name" name="name" className="form-input" placeholder="Enter your name" />
              <ErrorMessage name="name" component="div" className="form-error" />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="form-error" />
            </div>

            <div>
              <label htmlFor="role" className="form-label">
                Register as
              </label>
              <Field as="select" id="role" name="role" className="form-input">
                <option value="user">Student/Job Seeker</option>
                <option value="hr">HR/Recruiter</option>
              </Field>
              <ErrorMessage name="role" component="div" className="form-error" />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
                Log In
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Register

