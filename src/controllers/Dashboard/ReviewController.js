const Review = require("../../models/Review");
const {
  getUrlPath,
  saveBase64Image,
  sanitizeCategory,
  getCategoryFromRequest,
  deleteImageFile,
} = require("../../middleware/upload");

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { name, work, message, image } = req.body;
    const category = sanitizeCategory(getCategoryFromRequest(req) || "reviews");
    let imageUrl = null;

    // Handle file upload
    if (req.file) {
      imageUrl = getUrlPath(req.file.path, category, req);
    }
    // Handle base64 image from request body
    else if (
      image &&
      typeof image === "string" &&
      (image.includes("base64") || image.length > 100)
    ) {
      imageUrl = saveBase64Image(image, category, req);
    }

    const review = new Review({ name, image: imageUrl, work, message });
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Review creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, work, message, image } = req.body;
    const category = sanitizeCategory(getCategoryFromRequest(req));
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    let imageUrl = review.image; // Keep existing image by default

    // Handle file upload - delete old image first
    if (req.file) {
      if (review.image) deleteImageFile(review.image);
      imageUrl = getUrlPath(req.file.path, category, req);
    }
    // Handle base64 image from request body - delete old image first
    else if (
      image &&
      typeof image === "string" &&
      (image.includes("base64") || image.length > 100)
    ) {
      if (review.image) deleteImageFile(review.image);
      imageUrl = saveBase64Image(image, category, req);
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { name, image: imageUrl, work, message },
      { new: true },
    );
    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
