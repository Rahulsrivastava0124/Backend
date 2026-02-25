const express = require("express");
const router = express.Router();
const {
  upload,
  autoDetectCategoryMiddleware,
} = require("../middleware/upload");
const {
  addHomeHero,
  editHomeHero,
  getAllHomeHero,
  getHomeHero,
  deleteHomeHero,
} = require("../controllers/Dashboard/HomeHeroController");

// Add HomeHero
router.post(
  "/homehero",
  autoDetectCategoryMiddleware,
  upload.single("image"),
  addHomeHero,
);
// Edit HomeHero
router.put(
  "/homehero/:id",
  autoDetectCategoryMiddleware,
  upload.single("image"),
  editHomeHero,
);
// View all HomeHero
router.get("/homehero", getAllHomeHero);
// View single HomeHero
router.get("/homehero/:id", getHomeHero);
// Delete HomeHero
router.delete("/homehero/:id", deleteHomeHero);

module.exports = router;
