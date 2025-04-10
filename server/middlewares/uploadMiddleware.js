import multer from "multer";
import path from "path";

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (allow only images)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG images are allowed!"), false);
  }
};

// Only allow a **single** image upload
const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;
