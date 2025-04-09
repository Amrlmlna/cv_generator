// src/components/jobs/PostJobForm.jsx
import { useState } from "react";
import { createJob } from "../../services/jobService";

const PostJobForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary_range: "",
    description: "",
    requirements: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(formData);
      if (onSuccess) onSuccess(); // panggil callback misalnya untuk refresh data
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-2">Post a New Job</h2>

      {[
        { label: "Job Title", name: "title" },
        { label: "Company", name: "company" },
        { label: "Location", name: "location" },
        { label: "Salary Range", name: "salary_range" },
        { label: "Description", name: "description" },
        { label: "Requirements", name: "requirements" },
      ].map(({ label, name }) => (
        <div key={name}>
          <label className="block font-medium mb-1">{label}</label>
          <input
            type="text"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
      ))}

      <div>
        <label className="block font-medium mb-1">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input w-full"
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input w-full"
        >
          <option>Active</option>
          <option>Closed</option>
          <option>Draft</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Submit Job
      </button>
    </form>
  );
};

export default PostJobForm;
