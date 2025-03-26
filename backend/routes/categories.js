import express from "express"
import { body, param, validationResult } from "express-validator"
import { verifyToken, isHR } from "../middleware/auth.js"
import { query } from "../config/db.js"

const router = express.Router()

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await query("SELECT * FROM categories ORDER BY name")

    res.json({
      success: true,
      categories,
    })
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    })
  }
})

// Create a new category (HR only)
router.post(
  "/",
  verifyToken,
  isHR,
  [body("name").notEmpty().withMessage("Category name is required")],
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
      const { name } = req.body

      // Check if category already exists
      const existingCategories = await query("SELECT * FROM categories WHERE name = ?", [name])

      if (existingCategories.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        })
      }

      // Insert category
      const result = await query("INSERT INTO categories (name) VALUES (?)", [name])

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        category: {
          id: result.insertId,
          name,
        },
      })
    } catch (error) {
      console.error("Create category error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while creating category",
      })
    }
  },
)

// Delete a category (HR only)
router.delete(
  "/:id",
  verifyToken,
  isHR,
  param("id").isInt().withMessage("Category ID must be an integer"),
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
      const categoryId = req.params.id

      // Check if category exists
      const categories = await query("SELECT * FROM categories WHERE id = ?", [categoryId])

      if (categories.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        })
      }

      // Delete category
      await query("DELETE FROM categories WHERE id = ?", [categoryId])

      res.json({
        success: true,
        message: "Category deleted successfully",
      })
    } catch (error) {
      console.error("Delete category error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while deleting category",
      })
    }
  },
)

export default router

