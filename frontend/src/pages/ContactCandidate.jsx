"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../components/Spinner";

const ContactCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${id}/public`);

        if (response.data.success) {
          setCandidate(response.data.user);
        } else {
          setError("Failed to load candidate information");
        }
      } catch (err) {
        console.error("Error fetching candidate:", err);
        setError("An error occurred while fetching candidate information");

        // For development, use mock data if API fails
        if (process.env.NODE_ENV === "development") {
          setCandidate({
            name: "John Doe",
            email: "john@example.com",
          });
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ submitting: true, success: false, error: null });

    try {
      // In a real app, this would send to your backend
      // await axios.post('/api/contact-candidate', {
      //   candidateId: id,
      //   ...formData
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        submitting: false,
        success: true,
        error: null,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });

      // Redirect after successful submission
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Error contacting candidate:", err);
      setSubmitStatus({
        submitting: false,
        success: false,
        error: "Failed to send message. Please try again later.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="mb-6">{error || "Candidate not found"}</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (submitStatus.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p>
              Your message has been sent to {candidate.name}. They will contact
              you soon.
            </p>
          </div>
          <p className="mb-6">
            You will be redirected to the home page in a few seconds...
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact {candidate.name}</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-6">
            Fill out the form below to contact {candidate.name} about their CV.
            They will receive your message and can respond directly to your
            email.
          </p>

          {submitStatus.error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
              {submitStatus.error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="company"
                className="block text-gray-700 font-medium mb-2"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Introduce yourself and explain why you're interested in this candidate..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitStatus.submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {submitStatus.submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactCandidate;
