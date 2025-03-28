const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const db = require("../config/db");
const auth = require("../middleware/auth");
require("dotenv").config();

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Get career path recommendations
router.get("/career-path", auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's education history
    const [education] = await db.query(
      `SELECT e.* FROM education e
       JOIN personal_info pi ON e.personal_info_id = pi.id
       WHERE pi.user_id = ?`,
      [userId]
    );

    let prompt = "Based on the following education history:\n";

    if (education && education.length > 0) {
      education.forEach((edu) => {
        prompt += `- ${edu.degree} in ${edu.field_of_study} from ${
          edu.institution
        } (${
          edu.start_date ? new Date(edu.start_date).getFullYear() : "N/A"
        } - ${
          edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"
        })\n`;
      });
    } else {
      prompt += "No education history available.\n";
    }

    // Get questionnaire responses if available
    const [questionnaireResponses] = await db.query(
      `SELECT qr.*, qq.question, qq.category_id, qo.option_text
       FROM user_questionnaire_responses qr
       JOIN questionnaire_questions qq ON qr.question_id = qq.id
       LEFT JOIN questionnaire_options qo ON qr.option_id = qo.id
       WHERE qr.user_id = ?`,
      [userId]
    );

    // Add questionnaire data to the prompt if available
    if (questionnaireResponses && questionnaireResponses.length > 0) {
      // Organize responses by category
      const categorizedResponses = {};

      for (const response of questionnaireResponses) {
        const {
          category_id,
          question,
          option_text,
          text_response,
          scale_response,
        } = response;

        if (!categorizedResponses[category_id]) {
          categorizedResponses[category_id] = [];
        }

        let responseText = "";
        if (option_text) {
          responseText = option_text;
        } else if (text_response) {
          responseText = text_response;
        } else if (scale_response) {
          responseText = `${scale_response}/5`;
        }

        categorizedResponses[category_id].push(`${question}: ${responseText}`);
      }

      // Add to prompt
      prompt += "\n\nQuestionnaire Responses:\n";

      for (const categoryId in categorizedResponses) {
        const [categoryData] = await db.query(
          "SELECT name FROM questionnaire_categories WHERE id = ?",
          [categoryId]
        );

        if (categoryData.length > 0) {
          prompt += `\n${categoryData[0].name}:\n`;
          categorizedResponses[categoryId].forEach((response) => {
            prompt += `- ${response}\n`;
          });
        }
      }
    }

    prompt +=
      '\n\nBased on both the education history AND the questionnaire responses (if available), suggest 3-5 potential career paths that would be a good fit. For each career path, provide a brief explanation of why it\'s a good match based on the person\'s background, interests, skills, and preferences. Format the response as JSON with the following structure: [{ "title": "Career Title", "description": "Brief description", "reasons": ["Reason 1", "Reason 2", "Reason 3"] }]';

    // Call OpenAI API
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    let careerPaths = [];
    try {
      // Try to parse the response as JSON
      careerPaths = JSON.parse(completion.data.choices[0].text.trim());
    } catch (error) {
      // If parsing fails, return the raw text
      careerPaths = completion.data.choices[0].text.trim();
    }

    res.json({ careerPaths });
  } catch (error) {
    console.error("Error generating career path:", error);
    res.status(500).json({ error: "Failed to generate career path" });
  }
});

module.exports = router;
