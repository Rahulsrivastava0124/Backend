const Amenity = require("../../models/Amenity");
const {
  getUrlPath,
  saveBase64Image,
  sanitizeCategory,
  getCategoryFromRequest,
} = require("../../middleware/upload");

// Create a new amenity (expects req.file for image or base64 in body)
exports.createAmenity = async (req, res) => {
  try {
    const { title, image } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "amenities",
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

    const amenity = new Amenity({
      image: imageUrl,
      title,
    });
    await amenity.save();
    res.status(201).json({
      _id: amenity._id,
      title: amenity.title,
      image: amenity.image,
      createdAt: amenity.createdAt,
      updatedAt: amenity.updatedAt,
    });
  } catch (error) {
    console.error("Amenity creation error:", error);
    res.status(400).json({ error: error.message });
  }
};

// List all amenities
exports.listAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find();
    const result = amenities.map((a) => ({
      _id: a._id,
      title: a.title,
      image: a.image,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
