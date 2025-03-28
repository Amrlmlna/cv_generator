const express = require("express");
const router = express.Router();
const questionnaireController = require("../controllers/questionnaireController");
const auth = require("../middleware/auth");

// Get all questionnaire categories
router.get("/categories", questionnaireController.getCategories);

// Get questions by category
router.get(
  "/questions/:categoryId",
  questionnaireController.getQuestionsByCategory
);

// Submit questionnaire responses (requires authentication)
router.post("/submit", auth, questionnaireController.submitResponses);

// Get career recommendations based on questionnaire responses (requires authentication)
router.get(
  "/recommendations",
  auth,
  questionnaireController.getCareerRecommendations
);

// Get user's questionnaire responses (requires authentication)
router.get("/responses", auth, questionnaireController.getUserResponses);

module.exports = router;
