const express = require("express")
const { body } = require("express-validator")
const { register, login, getMe } = require("../controllers/authController")
const { protect } = require("../middlewares/auth")

const router = express.Router()

// Register route with validation
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["jobSeeker", "recruiter"]).withMessage("Role must be either jobSeeker or recruiter"),
  ],
  register,
)

// Login route with validation
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  login,
)

// Get current user profile
router.get("/me", protect, getMe)

module.exports = router

