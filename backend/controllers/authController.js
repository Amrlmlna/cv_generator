import { validationResult } from "express-validator"
import authService from "../services/authService.js"

// Register a new user
export const register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    })
  }

  try {
    const { name, email, password, role } = req.body
    const result = await authService.registerUser(name, email, password, role)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error.message === "User already exists") {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    })
  }
}

// Login user
export const login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    })
  }

  try {
    const { email, password } = req.body
    const result = await authService.loginUser(email, password)

    res.json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    console.error("Login error:", error)

    if (error.message === "Invalid credentials") {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error during login",
    })
  }
}

export default {
  register,
  login,
}

