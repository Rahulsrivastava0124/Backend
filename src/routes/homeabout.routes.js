const express = require("express");
const router = express.Router();
const {
  upload,
  autoDetectCategoryMiddleware,
} = require("../middleware/upload");
const {
  addHomeAbout,
  editHomeAbout,
  getHomeAbout,
} = require("../controllers/Dashboard/HomeAboutController");

// Add HomeAbout (create once)
router.post(
  "/homeabout",
  autoDetectCategoryMiddleware,
  upload.single("image"),
  addHomeAbout,
);
// Edit the single HomeAbout entry
router.put(
  "/homeabout/:id",
  autoDetectCategoryMiddleware,
  upload.single("image"),
  editHomeAbout,
);
// Get the single HomeAbout entry
router.get("/homeabout", getHomeAbout);

module.exports = router;
