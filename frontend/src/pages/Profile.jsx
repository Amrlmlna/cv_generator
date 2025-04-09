"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentUser } from "../services/authService";

const Profile = () => {
  const { currentUser, login } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    role: currentUser?.role || "jobSeeker",
    phone: currentUser?.phone || "",
    location: currentUser?.location || "",
    bio: currentUser?.bio || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getCurrentUser();

      if (response.success) {
        const userData = response.data;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "jobSeeker",
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // In a real implementation, this would be an API call to update the user profile
      // For now, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the user in context/localStorage
      const updatedUser = {
        ...currentUser,
        ...formData,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      login(updatedUser);

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Your Profile</h1>
        <p className="text-secondary-600">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true} // Email cannot be changed
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="input"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="form-label">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                className="input"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself and your professional background"
              ></textarea>
            </div>

            <div>
              <label className="form-label">Account Type</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  className={`p-3 border rounded-md text-center transition-colors ${
                    formData.role === "jobSeeker"
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-secondary-300 text-secondary-500"
                  }`}
                  onClick={() =>
                    isEditing &&
                    setFormData((prev) => ({ ...prev, role: "jobSeeker" }))
                  }
                  disabled={!isEditing}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  className={`p-3 border rounded-md text-center transition-colors ${
                    formData.role === "recruiter"
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-secondary-300 text-secondary-500"
                  }`}
                  onClick={() =>
                    isEditing &&
                    setFormData((prev) => ({ ...prev, role: "recruiter" }))
                  }
                  disabled={!isEditing}
                >
                  Recruiter
                </button>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold mb-6">Account Security</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium text-secondary-900 mb-2">
              Change Password
            </h3>
            <p className="text-secondary-600 text-sm mb-4">
              Ensure your account is using a secure password
            </p>
            <button className="btn btn-outline">Update Password</button>
          </div>

          <div className="pt-4 border-t border-secondary-200">
            <h3 className="text-base font-medium text-secondary-900 mb-2">
              Two-Factor Authentication
            </h3>
            <p className="text-secondary-600 text-sm mb-4">
              Add an additional layer of security to your account
            </p>
            <button className="btn btn-outline">Enable 2FA</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
