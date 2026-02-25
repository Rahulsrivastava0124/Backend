const express = require("express");
const router = express.Router();
const {
  upload,
  autoDetectCategoryMiddleware,
} = require("../middleware/upload");
const ReviewController = require("../controllers/Dashboard/ReviewController");

// Add a review
router.post(
  "/reviews",
  autoDetectCategoryMiddleware,
  upload.single("image"),
  ReviewController.addReview,
);

// Get all reviews
router.get("/reviews", ReviewController.getReviews);

// Update a review
router.put(
  "/reviews/:id",
  autoDetectCategoryMiddleware,
  upload.single("image"),
  ReviewController.updateReview,
);

// Delete a review
router.delete("/reviews/:id", ReviewController.deleteReview);

module.exports = router;
