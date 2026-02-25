const HomeHero = require("../../models/HomeHero");
const {
  getUrlPath,
  saveBase64Image,
  sanitizeCategory,
  getCategoryFromRequest,
  deleteImageFile,
} = require("../../middleware/upload");

// Add HomeHero
exports.addHomeHero = async (req, res) => {
  try {
    const { image } = req.body;
    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "homehero",
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

    const homeHero = new HomeHero({
      ...req.body,
      image: imageUrl,
    });
    await homeHero.save();
    res.status(201).json({ success: true, data: homeHero });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Edit HomeHero
exports.editHomeHero = async (req, res) => {
  try {
    const { image } = req.body;
    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "homehero",
    );
    const homeHero = await HomeHero.findById(req.params.id);
    if (!homeHero)
      return res.status(404).json({ success: false, message: "Not found" });

    let updateData = { ...req.body };

    // Handle file upload - delete old image first
    if (req.file) {
      if (homeHero.image) deleteImageFile(homeHero.image);
      updateData.image = getUrlPath(req.file.path, category, req);
    }
    // Handle base64 image from request body - delete old image first
    else if (
      image &&
      typeof image === "string" &&
      (image.includes("base64") || image.length > 100)
    ) {
      if (homeHero.image) deleteImageFile(homeHero.image);
      updateData.image = saveBase64Image(image, category, req);
    }

    const updatedHero = await HomeHero.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    res.json({ success: true, data: updatedHero });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// View all HomeHero
exports.getAllHomeHero = async (req, res) => {
  try {
    const homeHeroes = await HomeHero.find();
    res.json({ success: true, data: homeHeroes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// View single HomeHero
exports.getHomeHero = async (req, res) => {
  try {
    const homeHero = await HomeHero.findById(req.params.id);
    if (!homeHero)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: homeHero });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete HomeHero
exports.deleteHomeHero = async (req, res) => {
  try {
    const homeHero = await HomeHero.findByIdAndDelete(req.params.id);
    if (!homeHero)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
