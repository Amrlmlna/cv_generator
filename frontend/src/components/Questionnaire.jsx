"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Questionnaire = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/questionnaire/categories");
        setCategories(res.data);

        if (res.data.length > 0) {
          fetchQuestions(res.data[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load questionnaire. Please try again later.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchQuestions = async (categoryId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/questionnaire/questions/${categoryId}`);
      setQuestions(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      fetchQuestions(categories[currentCategoryIndex].id);
    }
  }, [currentCategoryIndex, categories]);

  useEffect(() => {
    // Calculate progress
    if (categories.length > 0) {
      setProgress(Math.round((currentCategoryIndex / categories.length) * 100));
    }
  }, [currentCategoryIndex, categories]);

  const handleResponse = (questionId, value, type) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        ...(type === "multiple_choice"
          ? { optionId: value }
          : type === "scale"
          ? { scaleResponse: value }
          : { textResponse: value }),
      },
    }));
  };

  const handleNext = () => {
    // Check if all questions in current category are answered
    const currentQuestions = questions;
    const allAnswered = currentQuestions.every((q) => responses[q.id]);

    if (!allAnswered) {
      setError("Please answer all questions before proceeding.");
      return;
    }

    setError(null);

    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Format responses for API
      const formattedResponses = Object.values(responses);

      await axios.post(
        "/api/questionnaire/submit",
        { responses: formattedResponses },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );

      // Redirect to recommendations page
      navigate("/get-hired");
    } catch (err) {
      console.error("Error submitting questionnaire:", err);
      setError("Failed to submit questionnaire. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Questionnaire Not Available</h2>
        <p>
          Sorry, the questionnaire is not available at the moment. Please try
          again later.
        </p>
      </div>
    );
  }

  const currentCategory = categories[currentCategoryIndex];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Start</span>
          <span>Complete</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{currentCategory.name}</h2>
      {currentCategory.description && (
        <p className="mb-6 text-gray-600">{currentCategory.description}</p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {questions.map((question) => (
              <div
                key={question.id}
                className="border rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-4">
                  {question.question}
                </h3>

                {question.type === "multiple_choice" && (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-start space-x-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={
                            responses[question.id]?.optionId === option.id
                          }
                          onChange={() =>
                            handleResponse(
                              question.id,
                              option.id,
                              "multiple_choice"
                            )
                          }
                          className="mt-1"
                        />
                        <span>{option.option_text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "scale" && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600 px-1">
                      <span>Not at all</span>
                      <span>Somewhat</span>
                      <span>Very much</span>
                    </div>
                    <div className="flex justify-between space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label
                          key={value}
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={value}
                            checked={
                              responses[question.id]?.scaleResponse === value
                            }
                            onChange={() =>
                              handleResponse(question.id, value, "scale")
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                              responses[question.id]?.scaleResponse === value
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {value}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {question.type === "text" && (
                  <textarea
                    rows="3"
                    className="w-full border rounded-md p-2"
                    value={responses[question.id]?.textResponse || ""}
                    onChange={(e) =>
                      handleResponse(question.id, e.target.value, "text")
                    }
                    placeholder="Type your answer here..."
                  ></textarea>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentCategoryIndex === 0}
              className={`px-6 py-2 rounded-md ${
                currentCategoryIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : currentCategoryIndex === categories.length - 1 ? (
                "Submit"
              ) : (
                "Next"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Questionnaire;
