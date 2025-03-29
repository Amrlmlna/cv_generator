import { validationResult } from "express-validator";
import * as cvService from "../services/cvService.js";

// Update the createCV function to use the cvService

export const createCV = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const userId = req.user.id;
    const {
      title,
      template,
      personalInfo,
      education,
      experience,
      skills,
      projects,
      categories,
      aiSuggestions,
      isPublic = false,
    } = req.body;

    // Create CV using the service
    const result = await cvService.createCV(
      userId,
      title,
      template,
      personalInfo,
      education,
      experience,
      skills,
      projects,
      categories,
      aiSuggestions,
      isPublic
    );

    res.status(201).json({
      success: true,
      message: "CV created successfully",
      cv: result,
    });
  } catch (error) {
    console.error("Create CV error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating CV",
    });
  }
};
