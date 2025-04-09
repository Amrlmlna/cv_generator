/**
 * Custom error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack)

  // Handle multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File too large. Maximum size is 5MB.",
    })
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token. Please log in again.",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Your session has expired. Please log in again.",
    })
  }

  // Default error response
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  })
}

/**
 * Async handler to avoid try/catch blocks in route handlers
 */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = { errorHandler, asyncHandler }

