require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import routes
const testRoute = require("./src/routes/routes");
const dashboardRoute = require("./src/routes/dashboard.routes");
const projectRoute = require("./src/routes/project.routes");
require("./src/config/mongo");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDir));

// Use routes
app.use("/", testRoute);
app.use("/dashboard", dashboardRoute);
app.use("/", projectRoute);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "File too large",
        message: "File size exceeds the limit of 10MB",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(413).json({
        error: "Too many files",
        message: "Number of files exceeds the limit of 50",
      });
    }
  }

  console.error("Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
