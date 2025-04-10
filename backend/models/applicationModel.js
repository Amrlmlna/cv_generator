const db = require("../config/db");

class ApplicationModel {
  static async getAll() {
    return await db.query(`
      SELECT * FROM job_applications
      ORDER BY created_at DESC
    `);
  }

  static async getById(id) {
    const [application] = await db.query(
      `
      SELECT * FROM job_applications
      WHERE id = ?
    `,
      [id]
    );
    return application;
  }

  static async getByJobId(jobId) {
    return await db.query(
      `
      SELECT ja.*, u.name, u.email, c.title as cv_title, c.cv_data,
             DATE_FORMAT(ja.created_at, '%Y-%m-%d') as applied_date
      FROM job_applications ja
      JOIN users u ON ja.user_id = u.id
      JOIN cvs c ON ja.cv_id = c.id
      WHERE ja.job_id = ?
      ORDER BY ja.created_at DESC
    `,
      [jobId]
    );
  }

  static async getByRecruiterId(recruiterId) {
    return await db.query(
      `
      SELECT ja.*, u.name, u.email, c.title as cv_title, c.cv_data,
             jl.title as job_title, jl.company,
             DATE_FORMAT(ja.created_at, '%Y-%m-%d') as applied_date
      FROM job_applications ja
      JOIN job_listings jl ON ja.job_id = jl.id
      JOIN users u ON ja.user_id = u.id
      JOIN cvs c ON ja.cv_id = c.id
      WHERE jl.recruiter_id = ?
      ORDER BY ja.created_at DESC
    `,
      [recruiterId]
    );
  }

  static async getByUserId(userId) {
    return await db.query(
      `
      SELECT ja.*, jl.title as job_title, jl.company, jl.location, jl.type,
             c.title as cv_title
      FROM job_applications ja
      JOIN job_listings jl ON ja.job_id = jl.id
      JOIN cvs c ON ja.cv_id = c.id
      WHERE ja.user_id = ?
      ORDER BY ja.created_at DESC
    `,
      [userId]
    );
  }

  static async create(data) {
    const { job_id, user_id, cv_id, cover_letter } = data;

    const result = await db.query(
      `
      INSERT INTO job_applications (job_id, user_id, cv_id, status, cover_letter)
      VALUES (?, ?, ?, 'Applied', ?)
    `,
      [job_id, user_id, cv_id, cover_letter]
    );

    return { id: result.insertId, ...data };
  }

  static async updateStatus(id, status) {
    await db.query(
      `
      UPDATE job_applications
      SET status = ?
      WHERE id = ?
    `,
      [status, id]
    );

    return { id, status };
  }

  static async delete(id) {
    await db.query(
      `
      DELETE FROM job_applications
      WHERE id = ?
    `,
      [id]
    );

    return { id };
  }

  static async getApplicationCount(jobId) {
    const [result] = await db.query(
      `
      SELECT COUNT(*) as count
      FROM job_applications
      WHERE job_id = ?
    `,
      [jobId]
    );

    return result.count;
  }

  static async checkExistingApplication(userId, jobId) {
    const [result] = await db.query(
      `
      SELECT COUNT(*) as count
      FROM job_applications
      WHERE user_id = ? AND job_id = ?
    `,
      [userId, jobId]
    );

    return result.count > 0;
  }
}

module.exports = ApplicationModel;
