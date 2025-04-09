"use client";

import { useState, useEffect } from "react";
import useCV from "../../store/cvStore";

const CVPersonalInfo = () => {
  const { personalInfo, setPersonalInfo } = useCV();
  const [formData, setFormData] = useState(personalInfo);

  // Update form data when personal info changes
  useEffect(() => {
    setFormData(personalInfo);
  }, [personalInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value,
    };

    // Update local state
    setFormData(updatedData);

    // Update store immediately - this is the key change for real-time updates
    setPersonalInfo(updatedData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="input"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="title" className="form-label">
            Professional Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="input"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="input"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>
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
          placeholder="e.g. New York, NY"
        />
      </div>

      <div>
        <label htmlFor="summary" className="form-label">
          Professional Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows="4"
          className="input"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Brief summary of your professional background and goals"
        ></textarea>
      </div>
    </div>
  );
};

export default CVPersonalInfo;
