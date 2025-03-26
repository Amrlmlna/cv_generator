import express from "express"
import { body, validationResult } from "express-validator"
import { verifyToken } from "../middleware/auth.js"
import { query } from "../config/db.js"

const router = express.Router()

// Get current user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Get user data without password
    const users = await query("SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?", [userId])

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      user: users[0],
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    })
  }
})

// Update user profile
router.put(
  "/profile",
  verifyToken,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Please provide a valid email"),
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
      const userId = req.user.id
      const { name, email } = req.body

      // Check if email is already taken by another user
      if (email) {
        const existingUsers = await query("SELECT id FROM users WHERE email = ? AND id != ?", [email, userId])

        if (existingUsers.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email is already taken",
          })
        }
      }

      // Update user data
      const updateFields = []
      const updateValues = []

      if (name) {
        updateFields.push("name = ?")
        updateValues.push(name)
      }

      if (email) {
        updateFields.push("email = ?")
        updateValues.push(email)
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        })
      }

      updateValues.push(userId)

      await query(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

      // Get updated user data
      const updatedUsers = await query("SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?", [
        userId,
      ])

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUsers[0],
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while updating profile",
      })
    }
  },
)

export default router

