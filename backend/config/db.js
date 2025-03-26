import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cv_generator",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Database connection established successfully")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Execute a query
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Query error:", error)
    throw error
  }
}

export { pool, testConnection, query }

