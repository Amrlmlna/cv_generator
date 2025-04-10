const db = require("../config/db");

class CVModel {
  static async getByUserId(userId) {
    return await db.query(
      `
      SELECT * FROM cvs
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
      [userId]
    );
  }

  static async getById(id) {
    const [cv] = await db.query(
      `
      SELECT * FROM cvs
      WHERE id = ?
    `,
      [id]
    );

    return cv;
  }
}

module.exports = CVModel;
