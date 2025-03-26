import { validationResult } from "express-validator"
import userService from "../services/userService.js"

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await userService.getUserById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    })
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
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

    // Check if email is already taken
    if (email) {
      const isEmailTaken = await userService.isEmailTakenByOtherUser(email, userId)
      if (isEmailTaken) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        })
      }
    }

    // Update user
    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      })
    }

    const updatedUser = await userService.updateUser(userId, updateData)

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    })
  }
}

export default {
  getProfile,
  updateProfile,
}

