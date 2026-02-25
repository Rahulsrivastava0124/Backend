const express = require("express");
const router = express.Router();
const AmenityController = require("../controllers/Dashboard/AmenityController");
const {
  upload,
  autoDetectCategoryMiddleware,
} = require("../middleware/upload");

// Create a new amenity
router.post(
  "/amenities",
  autoDetectCategoryMiddleware,
  upload.single("image"),
  AmenityController.createAmenity,
);

// Get all amenities
router.get("/amenities", AmenityController.listAmenities);

module.exports = router;
