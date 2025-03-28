const db = require("../config/db");

// Get all questionnaire categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT * FROM questionnaire_categories"
    );
    res.json(categories);
  } catch (error) {
    console.error("Error fetching questionnaire categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get questions by category
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Get questions for the category
    const [questions] = await db.query(
      "SELECT * FROM questionnaire_questions WHERE category_id = ?",
      [categoryId]
    );

    // For each question, get its options if it's multiple choice
    for (let question of questions) {
      if (question.type === "multiple_choice") {
        const [options] = await db.query(
          "SELECT * FROM questionnaire_options WHERE question_id = ?",
          [question.id]
        );
        question.options = options;
      }
    }

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit questionnaire responses
exports.submitResponses = async (req, res) => {
  try {
    const { userId } = req;
    const { responses } = req.body;

    // Begin transaction
    await db.query("START TRANSACTION");

    // Delete any existing responses for this user
    await db.query(
      "DELETE FROM user_questionnaire_responses WHERE user_id = ?",
      [userId]
    );

    // Insert new responses
    for (const response of responses) {
      const { questionId, optionId, textResponse, scaleResponse } = response;

      await db.query(
        "INSERT INTO user_questionnaire_responses (user_id, question_id, option_id, text_response, scale_response) VALUES (?, ?, ?, ?, ?)",
        [
          userId,
          questionId,
          optionId || null,
          textResponse || null,
          scaleResponse || null,
        ]
      );
    }

    // Commit transaction
    await db.query("COMMIT");

    res.json({ message: "Questionnaire responses submitted successfully" });
  } catch (error) {
    // Rollback transaction on error
    await db.query("ROLLBACK");
    console.error("Error submitting questionnaire responses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get career recommendations based on questionnaire responses
exports.getCareerRecommendations = async (req, res) => {
  try {
    const { userId } = req;

    // Get user's responses
    const [responses] = await db.query(
      `SELECT qr.*, qo.score, qq.category_id 
       FROM user_questionnaire_responses qr
       LEFT JOIN questionnaire_options qo ON qr.option_id = qo.id
       LEFT JOIN questionnaire_questions qq ON qr.question_id = qq.id
       WHERE qr.user_id = ?`,
      [userId]
    );

    if (responses.length === 0) {
      return res
        .status(404)
        .json({ message: "No questionnaire responses found" });
    }

    // Calculate scores by category
    const categoryScores = {};

    for (const response of responses) {
      const { category_id, score, scale_response } = response;

      if (!categoryScores[category_id]) {
        categoryScores[category_id] = 0;
      }

      // Add score from multiple choice or scale response
      if (score) {
        categoryScores[category_id] += score;
      } else if (scale_response) {
        categoryScores[category_id] += scale_response * 2; // Scale responses are 1-5, multiply by 2 to match option scores
      }
    }

    // Get user's education history
    const [education] = await db.query(
      `SELECT e.* FROM education e
       JOIN personal_info pi ON e.personal_info_id = pi.id
       WHERE pi.user_id = ?`,
      [userId]
    );

    // Generate career recommendations based on questionnaire responses and education
    // This is a simplified version - in a real app, you'd have a more sophisticated algorithm
    const [categories] = await db.query("SELECT * FROM categories");

    // Map category scores to career categories
    const recommendations = categories.map((category) => {
      // Calculate a match score based on questionnaire responses and education
      let matchScore = 0;

      // Factor in interests (category 1)
      if (categoryScores[1]) {
        matchScore += categoryScores[1] * 0.3;
      }

      // Factor in skills (category 2)
      if (categoryScores[2]) {
        matchScore += categoryScores[2] * 0.3;
      }

      // Factor in work style and values (categories 3 and 4)
      if (categoryScores[3] && categoryScores[4]) {
        matchScore += (categoryScores[3] + categoryScores[4]) * 0.2;
      }

      // Factor in personality (category 5)
      if (categoryScores[5]) {
        matchScore += categoryScores[5] * 0.2;
      }

      // Adjust score based on education match
      for (const edu of education) {
        if (
          edu.field_of_study &&
          (edu.field_of_study
            .toLowerCase()
            .includes(category.name.toLowerCase()) ||
            category.name
              .toLowerCase()
              .includes(edu.field_of_study.toLowerCase()))
        ) {
          matchScore += 20;
        }
      }

      return {
        ...category,
        matchScore: Math.min(100, Math.round(matchScore)),
      };
    });

    // Sort by match score (highest first)
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json(recommendations);
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's questionnaire responses
exports.getUserResponses = async (req, res) => {
  try {
    const { userId } = req;

    const [responses] = await db.query(
      `SELECT qr.*, qq.question, qq.type, qq.category_id, qo.option_text
       FROM user_questionnaire_responses qr
       JOIN questionnaire_questions qq ON qr.question_id = qq.id
       LEFT JOIN questionnaire_options qo ON qr.option_id = qo.id
       WHERE qr.user_id = ?`,
      [userId]
    );

    res.json(responses);
  } catch (error) {
    console.error("Error fetching user responses:", error);
    res.status(500).json({ message: "Server error" });
  }
};
