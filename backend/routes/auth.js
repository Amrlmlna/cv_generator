import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator"
import { query } from "../config/db.js"

const router = express.Router()

// Register a new user
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").isIn(["user", "hr"]).withMessage("Role must be either user or hr"),
  ],
  async (req, res) => {
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

      // Check if user already exists
      const existingUser = await query("SELECT * FROM users WHERE email = ?", [email])
      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Insert user into database
      const result = await query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
        name,
        email,
        hashedPassword,
        role,
      ])

      // Generate JWT token
      const token = jwt.sign({ id: result.insertId, name, email, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      })

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: result.insertId,
          name,
          email,
          role,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      })
    }
  },
)

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
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

      // Check if user exists
      const users = await query("SELECT * FROM users WHERE email = ?", [email])
      if (users.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      const user = users[0]

      // Check password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      )

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        success: false,
        message: "Server error during login",
      })
    }
  },
)

export default router

