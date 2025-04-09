const mysql = require("mysql2/promise")
const dotenv = require("dotenv")

dotenv.config()

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log("Database connection established successfully")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error.message)
    return false
  }
}

// Execute query with parameters
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Query error:", error.message)
    throw error
  }
}

module.exports = {
  pool,
  query,
  testConnection,
}

