const db = require("../config/db");

exports.getAllJobs = async () => {
  const rows = await db.query(
    "SELECT * FROM job_listings ORDER BY created_at DESC"
  );
  return rows;
};

exports.createJob = async (data) => {
  const {
    recruiter_id,
    title,
    company,
    location,
    description,
    requirements,
    type,
    salary_range,
    status,
  } = data;

  const result = await db.query(
    `INSERT INTO job_listings (recruiter_id, title, company, location, description, requirements, type, salary_range, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
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
};

exports.updateJob = async (id, data) => {
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
    `UPDATE job_listings SET title=?, company=?, location=?, description=?, requirements=?, type=?, salary_range=?, status=?, updated_at=NOW() WHERE id=?`,
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
};

exports.deleteJob = async (id) => {
  await db.query("DELETE FROM job_listings WHERE id = ?", [id]);
};
