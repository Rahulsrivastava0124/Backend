const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper function to auto-detect category from endpoint path
const detectCategoryFromPath = (path) => {
  if (!path) return "general";

  const categoryMap = {
    "/projects": "projects",
    "/reviews": "reviews",
    "/homehero": "homehero",
    "/homeabout": "homeabout",
    "/amenities": "amenities",
    "/paymentlist": "paymentlist",
    "/associatedeveloper": "associatedeveloper",
  };

  for (const [route, category] of Object.entries(categoryMap)) {
    if (path.includes(route)) {
      return category;
    }
  }

  return "general";
};

// Helper function to get category from request
// First check if category was set by middleware (req.uploadCategory)
// Then check query params, body, or auto-detect from path
const getCategoryFromRequest = (req) => {
  if (!req) return "general";

  // Priority 1: Category explicitly set by middleware
  if (req.uploadCategory) return req.uploadCategory;

  // Priority 2: Query parameter
  if (req.query && req.query.category) return req.query.category;

  // Priority 3: Body parameter
  if (req.body && req.body.category) return req.body.category;

  // Priority 4: Auto-detect from request path
  const detectedCategory = detectCategoryFromPath(req.path);
  if (detectedCategory !== "general") return detectedCategory;

  // Fallback to general
  return "general";
};

// Helper function to sanitize category name
const sanitizeCategory = (category) => {
  if (!category || typeof category !== "string") return "general";
  const sanitized = category.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase();
  return sanitized || "general";
};

// Helper function to ensure upload directory exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const category = sanitizeCategory(
        getCategoryFromRequest(req) || "general",
      );
      // Correct path: from src/middleware to root, then to uploads
      const uploadDir = path.join(__dirname, "../../uploads", category);
      console.log(`Upload directory path: ${uploadDir}`);
      console.log(`__dirname: ${__dirname}`);
      ensureUploadDir(uploadDir);
      console.log(`Uploading file to: ${uploadDir}, category: ${category}`);
      cb(null, uploadDir);
    } catch (err) {
      console.error("Error in destination:", err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const filename = `${timestamp}-${randomString}-${file.originalname}`;
      console.log(`Generated filename: ${filename}`);
      cb(null, filename);
    } catch (err) {
      console.error("Error in filename:", err);
      cb(err);
    }
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 50, // Maximum 50 files
  },
});

// Helper function to get full URL path from file path and request
const getUrlPath = (filePath, category, req = null) => {
  const relativePath = `/uploads/${sanitizeCategory(category)}/${path.basename(filePath)}`;

  // If request object is provided, construct full URL
  if (req) {
    const protocol = req.protocol || "http";
    const host = req.get("host") || "localhost:3000";
    return `${protocol}://${host}${relativePath}`;
  }

  // Fallback to relative path if no request object
  return relativePath;
};

// Helper function to get full URL from relative path
const getFullUrl = (relativePath, req) => {
  if (!relativePath) return null;

  // If already a full URL, return as is
  if (
    relativePath.startsWith("http://") ||
    relativePath.startsWith("https://")
  ) {
    return relativePath;
  }

  // Construct full URL
  const protocol = req.protocol || "http";
  const host = req.get("host") || "localhost:3000";
  return `${protocol}://${host}${relativePath}`;
};

// Helper function to convert base64 image to file and save it
const saveBase64Image = (base64String, category = "general", req = null) => {
  try {
    const sanitizedCategory = sanitizeCategory(category);
    const uploadDir = path.join(__dirname, "../../uploads", sanitizedCategory);
    ensureUploadDir(uploadDir);

    // Extract base64 data (remove data:image/png;base64, prefix if present)
    let base64Data = base64String;
    if (base64Data.includes(";base64,")) {
      base64Data = base64Data.split(";base64,")[1];
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Generate filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${randomString}-image.png`;
    const filepath = path.join(uploadDir, filename);

    // Write file to disk
    fs.writeFileSync(filepath, buffer);
    console.log(`Image saved: ${filepath}`);

    // Return the full URL
    return getUrlPath(filepath, sanitizedCategory, req);
  } catch (error) {
    console.error("Error saving base64 image:", error);
    throw error;
  }
};

// Middleware to automatically set category based on endpoint
const setCategoryMiddleware = (category) => {
  return (req, res, next) => {
    req.uploadCategory = category;
    next();
  };
};

// Middleware to auto-detect category from path and set it
const autoDetectCategoryMiddleware = (req, res, next) => {
  const detectedCategory = detectCategoryFromPath(req.path);
  req.uploadCategory = detectedCategory;
  console.log(
    `Auto-detected category: ${detectedCategory} from path: ${req.path}`,
  );
  next();
};

// Helper function to delete image file from disk
const deleteImageFile = (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract file path from URL
    let filePath;

    // If it's a full URL, extract the relative path
    if (imageUrl.includes("http://") || imageUrl.includes("https://")) {
      const urlPath = new URL(imageUrl).pathname; // Get /uploads/category/filename
      filePath = path.join(__dirname, "../..", urlPath);
    } else {
      // If it's already a relative path
      filePath = path.join(__dirname, "../..", imageUrl);
    }

    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old image: ${filePath}`);
    }
  } catch (error) {
    console.warn(`Warning: Could not delete old image: ${error.message}`);
    // Don't throw error, just warn - don't break the update process
  }
};

// Helper function to delete multiple image files
const deleteImageFiles = (imageUrls) => {
  if (!imageUrls) return;
  if (Array.isArray(imageUrls)) {
    imageUrls.forEach((url) => deleteImageFile(url));
  } else {
    deleteImageFile(imageUrls);
  }
};

module.exports = {
  upload,
  getUrlPath,
  getFullUrl,
  saveBase64Image,
  sanitizeCategory,
  getCategoryFromRequest,
  ensureUploadDir,
  detectCategoryFromPath,
  setCategoryMiddleware,
  autoDetectCategoryMiddleware,
  deleteImageFile,
  deleteImageFiles,
};
