const express = require("express");
const router = express.Router();
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middlewares/auth");

router.get("/", getJobs);
router.post("/", protect, createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
