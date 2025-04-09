const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { query } = require("../config/db")

/**
 * Register a new user
 */
const registerUser = async (userData) => {
  const { name, email, password, role } = userData

  // Check if user already exists
  const existingUser = await query("SELECT * FROM users WHERE email = ?", [email])

  if (existingUser.length > 0) {
    const error = new Error("User already exists with this email")
    error.statusCode = 400
    throw error
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Insert user into database
  const result = await query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
    name,
    email,
    hashedPassword,
    role || "jobSeeker",
  ])

  // Get the newly created user (without password)
  const newUser = await query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [result.insertId])

  return newUser[0]
}

/**
 * Login user and return JWT token
 */
const loginUser = async (email, password) => {
  // Find user by email
  const users = await query("SELECT * FROM users WHERE email = ?", [email])

  if (users.length === 0) {
    const error = new Error("Invalid credentials")
    error.statusCode = 401
    throw error
  }

  const user = users[0]

  // Check password
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    const error = new Error("Invalid credentials")
    error.statusCode = 401
    throw error
  }

  // Generate JWT token
  const token = generateToken(user.id)

  // Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = user

  return {
    ...userWithoutPassword,
    token,
  }
}

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

module.exports = {
  registerUser,
  loginUser,
}

