const jwt = require("jsonwebtoken")
const { asyncHandler } = require("./errorHandler")
const { query } = require("../config/db")

/**
 * Protect routes - Verify JWT token and attach user to request
 */
const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  // Check if token exists
  if (!token) {
    const error = new Error("Not authorized, no token provided")
    error.statusCode = 401
    throw error
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const user = await query("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.id])

    if (!user || user.length === 0) {
      const error = new Error("User not found")
      error.statusCode = 401
      throw error
    }

    // Attach user to request
    req.user = user[0]
    next()
  } catch (error) {
    error.statusCode = 401
    next(error)
  }
})

/**
 * Role-based authorization middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("User not authenticated")
      error.statusCode = 401
      return next(error)
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error("Not authorized to access this resource")
      error.statusCode = 403
      return next(error)
    }

    next()
  }
}

module.exports = { protect, authorize }

