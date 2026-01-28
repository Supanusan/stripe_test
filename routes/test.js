import express from "express";
import upload from "../utils/cloudinaryUpload.js";

const router = express.Router();

// Debug route to test upload without validation
router.post("/test_upload", upload.single("image"), (req, res) => {
  try {
    console.log("Test upload - File:", req.file);
    console.log("Test upload - Body:", req.body);

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      file: req.file,
      message: "Upload successful",
    });
  } catch (error) {
    console.error("Test upload error:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

export default router;
