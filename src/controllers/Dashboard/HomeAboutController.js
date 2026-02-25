const HomeAbout = require("../../models/HomeAbout");
const {
  getUrlPath,
  saveBase64Image,
  sanitizeCategory,
  getCategoryFromRequest,
  deleteImageFile,
} = require("../../middleware/upload");

// Add HomeAbout (only if one doesn't exist)
exports.addHomeAbout = async (req, res) => {
  try {
    const existing = await HomeAbout.findOne();
    if (existing) {
      return res
        .status(409)
        .json({
          success: false,
          message: "An entry already exists. Use the edit endpoint to update.",
        });
    }
    const { image } = req.body;
    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "homeabout",
    );
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

    const homeAbout = new HomeAbout({
      ...req.body,
      image: imageUrl,
    });
    await homeAbout.save();
    res.status(201).json({ success: true, data: homeAbout });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Edit the single HomeAbout entry
exports.editHomeAbout = async (req, res) => {
  try {
    const { image } = req.body;
    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "homeabout",
    );
    const homeAbout = await HomeAbout.findById(req.params.id);
    if (!homeAbout)
      return res.status(404).json({ success: false, message: "Not found" });

    let updateData = { ...req.body };

    // Handle file upload - delete old image first
    if (req.file) {
      if (homeAbout.image) deleteImageFile(homeAbout.image);
      updateData.image = getUrlPath(req.file.path, category, req);
    }
    // Handle base64 image from request body - delete old image first
    else if (
      image &&
      typeof image === "string" &&
      (image.includes("base64") || image.length > 100)
    ) {
      if (homeAbout.image) deleteImageFile(homeAbout.image);
      updateData.image = saveBase64Image(image, category, req);
    }

    const updatedAbout = await HomeAbout.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    res.json({ success: true, data: updatedAbout });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get the single HomeAbout entry
exports.getHomeAbout = async (req, res) => {
  try {
    const homeAbout = await HomeAbout.findOne();
    if (!homeAbout)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: homeAbout });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
