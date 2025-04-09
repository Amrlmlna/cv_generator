const { validationResult } = require("express-validator")
const { asyncHandler } = require("../middlewares/errorHandler")
const authService = require("../services/authService")

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password, role } = req.body

  // Register user
  const user = await authService.registerUser({
    name,
    email,
    password,
    role,
  })

  // Generate token and send response
  const token = authService.generateToken(user.id)

  res.status(201).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  })
})

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  // Login user
  const user = await authService.loginUser(email, password)

  res.status(200).json({
    success: true,
    data: user,
  })
})

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  })
})

module.exports = {
  register,
  login,
  getMe,
}

