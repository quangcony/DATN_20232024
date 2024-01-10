const express = require("express");
const router = express.Router();
const Multer = require("multer");
const storage = new Multer.memoryStorage();

// Upload Middleware
const upload = Multer({
  storage,
});

const uploadController = require("../controllers/UploadController");

router.post("/file", upload.single("file"), uploadController.uploadFile);

module.exports = router;
