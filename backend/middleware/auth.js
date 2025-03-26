import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    })
  }
}

// Middleware to check if user is HR
export const isHR = (req, res, next) => {
  if (req.user && req.user.role === "hr") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. HR role required.",
    })
  }
}

// Middleware to check if user is a regular user
export const isUser = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. User role required.",
    })
  }
}

