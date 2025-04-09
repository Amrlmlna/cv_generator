// /middleware/upload.js
const multer = require("multer");
const path = require("path");

// Tentukan folder dan nama file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs/"); // pastikan folder ini ada
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF allowed"));
  },
});

module.exports = upload;
