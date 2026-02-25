const AssociateDeveloper = require("../../models/AssociateDeveloper");
const {
  getUrlPath,
  saveBase64Image,
  sanitizeCategory,
  getCategoryFromRequest,
  deleteImageFiles,
} = require("../../middleware/upload");

const createAssociateDeveloper = async (req, res) => {
  try {
    const images = [];
    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "associatedeveloper",
    );

    // Handle file uploads
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        const imageUrl = getUrlPath(file.path, category, req);
        images.push(imageUrl);
      });
    }
    // Handle base64 images from request body
    else if (req.body.images && Array.isArray(req.body.images)) {
      req.body.images.forEach((img) => {
        if (
          img &&
          typeof img === "string" &&
          (img.includes("base64") || img.length > 100)
        ) {
          const imageUrl = saveBase64Image(img, category, req);
          images.push(imageUrl);
        }
      });
    }

    const newAssociateDeveloper = new AssociateDeveloper({
      images,
    });
    await newAssociateDeveloper.save();
    res.status(201).json({
      message: "Associate Developer created successfully",
      data: newAssociateDeveloper,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Associate Developer",
      error: error.message,
    });
  }
};

const getAssociateDeveloper = async (req, res) => {
  try {
    const associateDeveloper = await AssociateDeveloper.find();
    res.status(200).json({
      message: "Associate Developer fetched successfully",
      data: associateDeveloper,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Associate Developer",
      error: error.message,
    });
  }
};

const updateAssociateDeveloper = async (req, res) => {
  try {
    const { id, index } = req.params;
    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "associatedeveloper",
    );
    let associateDeveloper;
    if (id) {
      associateDeveloper = await AssociateDeveloper.findById(id);
      if (!associateDeveloper) {
        return res
          .status(404)
          .json({ message: "Associate Developer not found" });
      }
      // If index is also provided, remove the image at that index
      if (index !== undefined) {
        if (
          !Array.isArray(associateDeveloper.images) ||
          index < 0 ||
          index >= associateDeveloper.images.length
        ) {
          return res.status(400).json({ message: "Image index out of range" });
        }
        associateDeveloper.images.splice(index, 1);
        await associateDeveloper.save();
        return res.status(200).json({
          message: "Image removed from Associate Developer successfully",
          data: associateDeveloper,
        });
      }
    } else if (index !== undefined) {
      // If only index is provided, update the AssociateDeveloper at that index
      const all = await AssociateDeveloper.find();
      if (index < 0 || index >= all.length) {
        return res.status(404).json({ message: "Index out of range" });
      }
      associateDeveloper = all[index];
    } else {
      return res.status(400).json({ message: "ID or index required" });
    }

    // Delete old images first
    if (associateDeveloper.images && Array.isArray(associateDeveloper.images)) {
      deleteImageFiles(associateDeveloper.images);
    }

    let images = [];

    // Handle file uploads
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file) => {
        const imageUrl = getUrlPath(file.path, category, req);
        images.push(imageUrl);
      });
      associateDeveloper.images = images;
      await associateDeveloper.save();
    }
    // Handle base64 images from request body
    else if (req.body.images && Array.isArray(req.body.images)) {
      req.body.images.forEach((img) => {
        if (
          img &&
          typeof img === "string" &&
          (img.includes("base64") || img.length > 100)
        ) {
          const imageUrl = saveBase64Image(img, category, req);
          images.push(imageUrl);
        }
      });
      associateDeveloper.images = images;
      await associateDeveloper.save();
    }
    res.status(200).json({
      message: "Associate Developer updated successfully",
      data: associateDeveloper,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Associate Developer",
      error: error.message,
    });
  }
};

const deleteAssociateDeveloper = async (req, res) => {
  try {
    const { id, index } = req.params;
    let associateDeveloper;
    if (id) {
      associateDeveloper = await AssociateDeveloper.findByIdAndDelete(id);
    } else if (index !== undefined) {
      const all = await AssociateDeveloper.find();
      if (index < 0 || index >= all.length) {
        return res.status(404).json({ message: "Index out of range" });
      }
      associateDeveloper = all[index];
      await AssociateDeveloper.findByIdAndDelete(associateDeveloper._id);
    } else {
      return res.status(400).json({ message: "ID or index required" });
    }
    if (!associateDeveloper) {
      return res.status(404).json({ message: "Associate Developer not found" });
    }
    res.status(200).json({
      message: "Associate Developer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Associate Developer",
      error: error.message,
    });
  }
};

module.exports = {
  createAssociateDeveloper,
  getAssociateDeveloper,
  updateAssociateDeveloper,
  deleteAssociateDeveloper,
};
