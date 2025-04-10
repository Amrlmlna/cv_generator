const db = require("../config/db");

class JobModel {
  static async getAll() {
    const jobs = await db.query(`
      SELECT jl.*, 
             u.name as recruiter_name,
             (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = jl.id) as applicants_count
      FROM job_listings jl
      JOIN users u ON jl.recruiter_id = u.id
      ORDER BY jl.created_at DESC
    `);

    return jobs;
  }

  static async getById(id) {
    const [job] = await db.query(
      `
      SELECT jl.*, 
             u.name as recruiter_name,
             (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = jl.id) as applicants_count
      FROM job_listings jl
      JOIN users u ON jl.recruiter_id = u.id
      WHERE jl.id = ?
    `,
      [id]
    );

    return job;
  }

  static async getByRecruiterId(recruiterId) {
    return await db.query(
      `
      SELECT jl.*, 
             (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = jl.id) as applicants_count
      FROM job_listings jl
      WHERE jl.recruiter_id = ?
      ORDER BY jl.created_at DESC
    `,
      [recruiterId]
    );
  }

  static async create(data) {
    const {
      recruiter_id,
      title,
      company,
      location,
      description,
      requirements,
      type,
      salary_range,
      status = "Active",
    } = data;

    const result = await db.query(
      `
      INSERT INTO job_listings 
      (recruiter_id, title, company, location, description, requirements, type, salary_range, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        recruiter_id,
        title,
        company,
        location,
        description,
        requirements,
        type,
        salary_range,
        status,
      ]
    );

    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const {
      title,
      company,
      location,
      description,
      requirements,
      type,
      salary_range,
      status,
    } = data;

    await db.query(
      `
      UPDATE job_listings 
      SET title = ?, company = ?, location = ?, description = ?, 
          requirements = ?, type = ?, salary_range = ?, status = ?
      WHERE id = ?
    `,
      [
        title,
        company,
        location,
        description,
        requirements,
        type,
        salary_range,
        status,
        id,
      ]
    );

    return { id, ...data };
  }

  static async delete(id) {
    await db.query(
      `
      DELETE FROM job_listings
      WHERE id = ?
    `,
      [id]
    );

    return { id };
  }
}

module.exports = JobModel;
