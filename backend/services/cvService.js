import { query, pool } from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new CV
export const createCV = async (
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
) => {
  // Start a transaction
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Insert personal info
    const [personalInfoResult] = await connection.execute(
      "INSERT INTO personal_info (user_id, full_name, email, phone, address, linkedin, github, website, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        personalInfo.full_name,
        personalInfo.email,
        personalInfo.phone || null,
        personalInfo.address || null,
        personalInfo.linkedin || null,
        personalInfo.github || null,
        personalInfo.website || null,
        personalInfo.summary || null,
      ]
    );

    const personalInfoId = personalInfoResult.insertId;

    // Insert education entries
    if (education && education.length > 0) {
      for (const edu of education) {
        await connection.execute(
          "INSERT INTO education (personal_info_id, institution, degree, field_of_study, start_date, end_date, gpa, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            personalInfoId,
            edu.institution,
            edu.degree,
            edu.field_of_study || null,
            edu.start_date || null,
            edu.end_date || null,
            edu.gpa || null,
            edu.description || null,
          ]
        );
      }
    }

    // Insert experience entries
    if (experience && experience.length > 0) {
      for (const exp of experience) {
        await connection.execute(
          "INSERT INTO experience (personal_info_id, company, position, start_date, end_date, is_current, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            personalInfoId,
            exp.company,
            exp.position,
            exp.start_date || null,
            exp.end_date || null,
            exp.is_current || false,
            exp.description || null,
          ]
        );
      }
    }

    // Insert skills
    if (skills && skills.length > 0) {
      for (const skill of skills) {
        await connection.execute(
          "INSERT INTO skills (personal_info_id, name, proficiency) VALUES (?, ?, ?)",
          [personalInfoId, skill.name, skill.proficiency || "intermediate"]
        );
      }
    }

    // Insert projects
    if (projects && projects.length > 0) {
      for (const project of projects) {
        await connection.execute(
          "INSERT INTO projects (personal_info_id, name, description, start_date, end_date, url) VALUES (?, ?, ?, ?, ?, ?)",
          [
            personalInfoId,
            project.name,
            project.description || null,
            project.start_date || null,
            project.end_date || null,
            project.url || null,
          ]
        );
      }
    }

    // Insert CV
    const [cvResult] = await connection.execute(
      "INSERT INTO cvs (user_id, personal_info_id, title, template, is_public, ai_suggestions) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, personalInfoId, title, template, isPublic, aiSuggestions || null]
    );

    const cvId = cvResult.insertId;

    // Insert CV categories
    if (categories && categories.length > 0) {
      for (const categoryId of categories) {
        await connection.execute(
          "INSERT INTO cv_categories (cv_id, category_id) VALUES (?, ?)",
          [cvId, categoryId]
        );
      }
    }

    // Generate PDF (simplified version)
    const pdfFileName = `cv-${cvId}-${Date.now()}.pdf`;
    const pdfPath = path.join(__dirname, "../uploads", pdfFileName);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a simple PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Add content to PDF
    doc.fontSize(25).text(personalInfo.full_name, { align: "center" });
    doc.fontSize(10).text(personalInfo.email, { align: "center" });
    if (personalInfo.phone) doc.text(personalInfo.phone, { align: "center" });
    if (personalInfo.address)
      doc.text(personalInfo.address, { align: "center" });

    doc.moveDown();
    if (personalInfo.summary) {
      doc.fontSize(12).text("Summary", { underline: true });
      doc.fontSize(10).text(personalInfo.summary);
      doc.moveDown();
    }

    // Education
    if (education && education.length > 0) {
      doc.fontSize(12).text("Education", { underline: true });
      education.forEach((edu) => {
        doc
          .fontSize(10)
          .text(`${edu.degree} in ${edu.field_of_study || "N/A"}`);
        doc.text(`${edu.institution}`);
        if (edu.start_date && edu.end_date) {
          doc.text(`${edu.start_date} - ${edu.end_date}`);
        }
        if (edu.description) doc.text(edu.description);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Experience
    if (experience && experience.length > 0) {
      doc.fontSize(12).text("Experience", { underline: true });
      experience.forEach((exp) => {
        doc.fontSize(10).text(`${exp.position} at ${exp.company}`);
        if (exp.start_date) {
          doc.text(
            `${exp.start_date} - ${
              exp.is_current ? "Present" : exp.end_date || "N/A"
            }`
          );
        }
        if (exp.description) doc.text(exp.description);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Skills
    if (skills && skills.length > 0) {
      doc.fontSize(12).text("Skills", { underline: true });
      const skillsText = skills
        .map((s) => `${s.name} (${s.proficiency || "intermediate"})`)
        .join(", ");
      doc.fontSize(10).text(skillsText);
      doc.moveDown();
    }

    // Projects
    if (projects && projects.length > 0) {
      doc.fontSize(12).text("Projects", { underline: true });
      projects.forEach((project) => {
        doc.fontSize(10).text(project.name);
        if (project.description) doc.text(project.description);
        if (project.url) doc.text(`URL: ${project.url}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    doc.end();

    // Update CV with PDF URL
    await connection.execute("UPDATE cvs SET pdf_url = ? WHERE id = ?", [
      `/uploads/${pdfFileName}`,
      cvId,
    ]);

    // Commit transaction
    await connection.commit();

    return {
      id: cvId,
      title,
      template,
      pdf_url: `/uploads/${pdfFileName}`,
      created_at: new Date(),
    };
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Get CVs by user ID
export const getCVsByUserId = async (userId) => {
  const cvs = await query(
    `SELECT c.id, c.title, c.template, c.is_public, c.pdf_url, c.created_at, c.updated_at,
     p.full_name, p.email
     FROM cvs c
     JOIN personal_info p ON c.personal_info_id = p.id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC`,
    [userId]
  );

  // Get categories for each CV
  for (const cv of cvs) {
    const categories = await query(
      `SELECT c.id, c.name
       FROM categories c
       JOIN cv_categories cc ON c.id = cc.category_id
       WHERE cc.cv_id = ?`,
      [cv.id]
    );

    cv.categories = categories;
  }

  return cvs;
};

// Get CV by ID
export const getCVById = async (cvId) => {
  const cvs = await query(
    `SELECT c.id, c.user_id, c.personal_info_id, c.title, c.template, c.is_public, 
     c.ai_suggestions, c.pdf_url, c.created_at, c.updated_at
     FROM cvs c
     WHERE c.id = ?`,
    [cvId]
  );

  if (cvs.length === 0) {
    return null;
  }

  const cv = cvs[0];

  // Get personal info
  const personalInfos = await query(
    `SELECT * FROM personal_info WHERE id = ?`,
    [cv.personal_info_id]
  );
  cv.personalInfo = personalInfos[0];

  // Get education
  cv.education = await query(
    `SELECT * FROM education WHERE personal_info_id = ?`,
    [cv.personal_info_id]
  );

  // Get experience
  cv.experience = await query(
    `SELECT * FROM experience WHERE personal_info_id = ?`,
    [cv.personal_info_id]
  );

  // Get skills
  cv.skills = await query(`SELECT * FROM skills WHERE personal_info_id = ?`, [
    cv.personal_info_id,
  ]);

  // Get projects
  cv.projects = await query(
    `SELECT * FROM projects WHERE personal_info_id = ?`,
    [cv.personal_info_id]
  );

  // Get categories
  cv.categories = await query(
    `SELECT c.id, c.name
     FROM categories c
     JOIN cv_categories cc ON c.id = cc.category_id
     WHERE cc.cv_id = ?`,
    [cv.id]
  );

  return cv;
};

// Get CV by ID and user ID
export const getCVByIdAndUserId = async (cvId, userId) => {
  const cvs = await query("SELECT * FROM cvs WHERE id = ? AND user_id = ?", [
    cvId,
    userId,
  ]);

  return cvs.length > 0 ? cvs[0] : null;
};

// Update CV
export const updateCV = async (cvId, updateData, categories) => {
  // Update CV data
  if (Object.keys(updateData).length > 0) {
    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updateData)) {
      updateFields.push(`${key} = ?`);
      updateValues.push(value);
    }

    updateValues.push(cvId);

    await query(
      `UPDATE cvs SET ${updateFields.join(
        ", "
      )}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );
  }

  // Update categories if provided
  if (categories !== undefined) {
    // Delete existing categories
    await query("DELETE FROM cv_categories WHERE cv_id = ?", [cvId]);

    // Insert new categories
    if (categories.length > 0) {
      for (const categoryId of categories) {
        await query(
          "INSERT INTO cv_categories (cv_id, category_id) VALUES (?, ?)",
          [cvId, categoryId]
        );
      }
    }
  }
};

// Delete CV
export const deleteCV = async (cvId) => {
  await query("DELETE FROM cvs WHERE id = ?", [cvId]);
};

// Get public CVs
export const getPublicCVs = async (category, search) => {
  let sql = `
    SELECT c.id, c.title, c.template, c.pdf_url, c.created_at,
    p.full_name, p.email, p.summary,
    u.id as user_id, u.name as user_name
    FROM cvs c
    JOIN personal_info p ON c.personal_info_id = p.id
    JOIN users u ON c.user_id = u.id
    WHERE c.is_public = 1
  `;

  const params = [];

  // Filter by category if provided
  if (category) {
    sql += `
      AND c.id IN (
        SELECT cv_id FROM cv_categories WHERE category_id = ?
      )
    `;
    params.push(category);
  }

  // Search by name or summary if provided
  if (search) {
    sql += `
      AND (
        p.full_name LIKE ? OR
        p.summary LIKE ? OR
        c.title LIKE ?
      )
    `;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  sql += " ORDER BY c.created_at DESC";

  const cvs = await query(sql, params);

  // Get categories for each CV
  for (const cv of cvs) {
    const categories = await query(
      `SELECT c.id, c.name
       FROM categories c
       JOIN cv_categories cc ON c.id = cc.category_id
       WHERE cc.cv_id = ?`,
      [cv.id]
    );

    cv.categories = categories;

    // Get skills for each CV
    const skills = await query(
      `SELECT s.name, s.proficiency
       FROM skills s
       JOIN personal_info p ON s.personal_info_id = p.id
       JOIN cvs c ON p.id = c.personal_info_id
       WHERE c.id = ?`,
      [cv.id]
    );

    cv.skills = skills;
  }

  return cvs;
};

export default {
  createCV,
  getCVsByUserId,
  getCVById,
  getCVByIdAndUserId,
  updateCV,
  deleteCV,
  getPublicCVs,
};
