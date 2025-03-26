"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { FaSpinner, FaUser, FaEnvelope, FaLock } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
})

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Initial form values
  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
  }

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setUpdateSuccess(false)

    try {
      const success = await updateProfile(values)

      if (success) {
        setUpdateSuccess(true)
      }
    } catch (error) {
      console.error("Update profile error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Profile picture and role */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl mb-4">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
        </div>

        {/* Success message */}
        {updateSuccess && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md mb-4">
            Profile updated successfully!
          </div>
        )}

        {/* Profile form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label flex items-center">
                  <FaUser className="mr-2 text-gray-500 dark:text-gray-400" /> Name
                </label>
                <Field type="text" id="name" name="name" className="form-input" />
                <ErrorMessage name="name" component="div" className="form-error" />
              </div>

              <div>
                <label htmlFor="email" className="form-label flex items-center">
                  <FaEnvelope className="mr-2 text-gray-500 dark:text-gray-400" /> Email
                </label>
                <Field type="email" id="email" name="email" className="form-input" />
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>

              <div>
                <label className="form-label flex items-center">
                  <FaLock className="mr-2 text-gray-500 dark:text-gray-400" /> Password
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Password changes are not supported in this version.
                </p>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Profile

