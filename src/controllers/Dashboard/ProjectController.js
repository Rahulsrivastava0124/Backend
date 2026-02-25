const Project = require("../../models/Project");
const path = require("path");
const {
  getUrlPath,
  sanitizeCategory,
  getCategoryFromRequest,
  saveBase64Image,
  deleteImageFiles,
} = require("../../middleware/upload");

// Helper to clean image arrays: if value is [{}] or [null] or [undefined], set to null or []
function cleanImageArray(arr) {
  if (!Array.isArray(arr)) return null;
  // Remove empty objects, null, undefined
  const filtered = arr.filter(
    (img) => typeof img === "string" && img.trim() !== "",
  );
  return filtered.length > 0 ? filtered : null;
}

// Helper to map uploaded files to the correct nested fields in the project object
function mapImagesToProjectData(body, files, req) {
  // Parse JSON fields if they are stringified (from multipart/form-data)
  let data = { ...body };
  const category = sanitizeCategory(getCategoryFromRequest(req) || "projects");

  // Parse nested objects/arrays if needed
  const parseIfString = (field) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  };
  data.project_info = parseIfString(data.project_info);
  data.hero = parseIfString(data.hero);
  data.overview = parseIfString(data.overview);
  data.amenities = parseIfString(data.amenities);
  data.highlights = parseIfString(data.highlights);
  data.zones = parseIfString(data.zones);
  data.location_advantage = parseIfString(data.location_advantage);
  data.layout_and_floorplan = parseIfString(data.layout_and_floorplan);
  data.about = parseIfString(data.about);

  // Helper function to process images (both file uploads and base64)
  const processImage = (imageInput) => {
    if (typeof imageInput === "string") {
      // Check if it's base64
      if (imageInput.includes(";base64,") || imageInput.startsWith("data:")) {
        return saveBase64Image(imageInput, category, req);
      }
      // Otherwise it's already a URL or path
      return imageInput;
    }
    return imageInput;
  };

  const processImageArray = (imageInputs) => {
    if (!imageInputs) return null;
    if (!Array.isArray(imageInputs)) {
      return processImage(imageInputs);
    }
    const processed = imageInputs
      .map((img) => {
        if (typeof img === "string" && img.trim()) {
          return processImage(img);
        }
        return null;
      })
      .filter((img) => img !== null && img !== "");
    return processed.length > 0 ? processed : null;
  };

  // --- Process and merge project_logo arrays if present ---
  if (data.project_info) {
    let logos = [];
    // Accept both project_logo and projectLogo for flexibility
    if (Array.isArray(data.project_info.project_logo)) {
      logos = logos.concat(data.project_info.project_logo);
    } else if (typeof data.project_info.project_logo === "string") {
      logos.push(data.project_info.project_logo);
    }
    // If project_logo is sent at root level (not inside project_info)
    if (Array.isArray(data.project_logo)) {
      logos = logos.concat(data.project_logo);
    } else if (typeof data.project_logo === "string") {
      logos.push(data.project_logo);
    }
    // Process images (convert base64 to files)
    logos = logos
      .map((l) => {
        if (typeof l === "string" && l.trim() !== "") {
          return processImage(l);
        }
        return null;
      })
      .filter((l) => l !== null && l !== "");

    data.project_info.project_logo = logos.length > 0 ? logos : null;
    // Map project_info to project for schema compatibility
    data.project = data.project_info;
    delete data.project_info;
  }

  if (files && Array.isArray(files)) {
    // hero.hero_images
    const heroImages = files.filter((f) => f.fieldname === "hero.hero_images");
    if (!data.hero) data.hero = {};
    data.hero.hero_images =
      heroImages.length > 0
        ? heroImages.map((f) => getUrlPath(f.path, category, req))
        : null;
    // overview.overview_gallery_images
    const overviewGallery = files.filter(
      (f) => f.fieldname === "overview.overview_gallery_images",
    );
    if (!data.overview) data.overview = {};
    data.overview.overview_gallery_images =
      overviewGallery.length > 0
        ? overviewGallery.map((f) => getUrlPath(f.path, category, req))
        : null;
    // highlights[].image
    if (Array.isArray(data.highlights)) {
      data.highlights.forEach((highlight, idx) => {
        const highlightImages = files.filter(
          (f) => f.fieldname === `highlights[${idx}].image`,
        );
        highlight.image =
          highlightImages.length > 0
            ? highlightImages.map((f) => getUrlPath(f.path, category, req))
            : null;
      });
    }
    // zones[].image
    if (Array.isArray(data.zones)) {
      data.zones.forEach((zone, idx) => {
        const zoneImages = files.filter(
          (f) => f.fieldname === `zones[${idx}].image`,
        );
        zone.image =
          zoneImages.length > 0
            ? zoneImages.map((f) => getUrlPath(f.path, category, req))
            : null;
      });
    }
    // layout_and_floorplan.layouts[].image
    if (
      data.layout_and_floorplan &&
      Array.isArray(data.layout_and_floorplan.layouts)
    ) {
      data.layout_and_floorplan.layouts.forEach((layout, idx) => {
        const layoutImages = files.filter(
          (f) => f.fieldname === `layout_and_floorplan.layouts[${idx}].image`,
        );
        layout.image =
          layoutImages.length > 0
            ? layoutImages.map((f) => getUrlPath(f.path, category, req))
            : null;
      });
    }
    // about.left_image
    const aboutLeftImages = files.filter(
      (f) => f.fieldname === "about.left_image",
    );
    if (!data.about) data.about = {};
    data.about.left_image =
      aboutLeftImages.length > 0
        ? aboutLeftImages.map((f) => getUrlPath(f.path, category, req))
        : null;
  }

  // Process base64 images in body (if sent as JSON)
  if (data.hero && data.hero.hero_images) {
    data.hero.hero_images = processImageArray(data.hero.hero_images);
  }
  if (data.overview && data.overview.overview_gallery_images) {
    data.overview.overview_gallery_images = processImageArray(
      data.overview.overview_gallery_images,
    );
  }
  if (Array.isArray(data.highlights)) {
    data.highlights.forEach((h) => {
      if (h.image) {
        h.image = processImageArray(h.image);
      }
    });
  }
  if (Array.isArray(data.zones)) {
    data.zones.forEach((z) => {
      if (z.image) {
        z.image = processImageArray(z.image);
      }
    });
  }
  if (
    data.layout_and_floorplan &&
    Array.isArray(data.layout_and_floorplan.layouts)
  ) {
    data.layout_and_floorplan.layouts.forEach((l) => {
      if (l.image) {
        l.image = processImageArray(l.image);
      }
    });
  }
  if (data.about && data.about.left_image) {
    data.about.left_image = processImageArray(data.about.left_image);
  }

  // Clean up image fields if they are [{}] or invalid
  if (data.hero && Array.isArray(data.hero.hero_images)) {
    data.hero.hero_images = cleanImageArray(data.hero.hero_images);
  }
  if (data.overview && Array.isArray(data.overview.overview_gallery_images)) {
    data.overview.overview_gallery_images = cleanImageArray(
      data.overview.overview_gallery_images,
    );
  }
  if (Array.isArray(data.highlights)) {
    data.highlights.forEach((h) => {
      if (Array.isArray(h.image)) h.image = cleanImageArray(h.image);
    });
  }
  if (Array.isArray(data.zones)) {
    data.zones.forEach((z) => {
      if (Array.isArray(z.image)) z.image = cleanImageArray(z.image);
    });
  }
  if (
    data.layout_and_floorplan &&
    Array.isArray(data.layout_and_floorplan.layouts)
  ) {
    data.layout_and_floorplan.layouts.forEach((l) => {
      if (Array.isArray(l.image)) l.image = cleanImageArray(l.image);
    });
  }
  if (data.about && Array.isArray(data.about.left_image)) {
    data.about.left_image = cleanImageArray(data.about.left_image);
  }

  return data;
}

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const data = mapImagesToProjectData(req.body, req.files, req);
    const project = new Project(data);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single project by ID
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// List all projects
exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find().select("+_id");
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Helper to compare image arrays
function imagesChanged(newImages, oldImages) {
  if (!newImages && !oldImages) return false;
  if (!newImages || !oldImages) return true;

  const newArr = Array.isArray(newImages) ? newImages : [newImages];
  const oldArr = Array.isArray(oldImages) ? oldImages : [oldImages];

  if (newArr.length !== oldArr.length) return true;
  return !newArr.every((img, idx) => img === oldArr[idx]);
}

// Update a project by ID
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const data = mapImagesToProjectData(req.body, req.files, req);

    // Delete old images ONLY if they actually changed
    const projectLogoChanged = imagesChanged(
      data.project?.project_logo,
      project.project_info?.project_logo,
    );
    if (projectLogoChanged && project.project_info?.project_logo) {
      deleteImageFiles(project.project_info.project_logo);
    } else if (!projectLogoChanged && project.project_info?.project_logo) {
      if (!data.project) data.project = {};
      data.project.project_logo = project.project_info.project_logo;
    }

    const heroImagesChanged = imagesChanged(
      data.hero?.hero_images,
      project.hero?.hero_images,
    );
    if (heroImagesChanged && project.hero?.hero_images) {
      deleteImageFiles(project.hero.hero_images);
    } else if (!heroImagesChanged && project.hero?.hero_images) {
      if (!data.hero) data.hero = {};
      data.hero.hero_images = project.hero.hero_images;
    }

    const overviewChanged = imagesChanged(
      data.overview?.overview_gallery_images,
      project.overview?.overview_gallery_images,
    );
    if (overviewChanged && project.overview?.overview_gallery_images) {
      deleteImageFiles(project.overview.overview_gallery_images);
    } else if (!overviewChanged && project.overview?.overview_gallery_images) {
      if (!data.overview) data.overview = {};
      data.overview.overview_gallery_images =
        project.overview.overview_gallery_images;
    }

    // Handle highlights
    if (Array.isArray(data.highlights) && project.highlights) {
      data.highlights.forEach((h, idx) => {
        const highlightChanged = imagesChanged(
          h.image,
          project.highlights[idx]?.image,
        );
        if (highlightChanged && project.highlights[idx]?.image) {
          deleteImageFiles(project.highlights[idx].image);
        } else if (!highlightChanged && project.highlights[idx]?.image) {
          h.image = project.highlights[idx].image;
        }
      });
    } else if (!data.highlights && project.highlights) {
      data.highlights = project.highlights;
    }

    // Handle zones
    if (Array.isArray(data.zones) && project.zones) {
      data.zones.forEach((z, idx) => {
        const zoneChanged = imagesChanged(z.image, project.zones[idx]?.image);
        if (zoneChanged && project.zones[idx]?.image) {
          deleteImageFiles(project.zones[idx].image);
        } else if (!zoneChanged && project.zones[idx]?.image) {
          z.image = project.zones[idx].image;
        }
      });
    } else if (!data.zones && project.zones) {
      data.zones = project.zones;
    }

    // Handle layout and floorplan
    if (
      data.layout_and_floorplan?.layouts &&
      project.layout_and_floorplan?.layouts
    ) {
      data.layout_and_floorplan.layouts.forEach((l, idx) => {
        const layoutChanged = imagesChanged(
          l.image,
          project.layout_and_floorplan.layouts[idx]?.image,
        );
        if (layoutChanged && project.layout_and_floorplan.layouts[idx]?.image) {
          deleteImageFiles(project.layout_and_floorplan.layouts[idx].image);
        } else if (
          !layoutChanged &&
          project.layout_and_floorplan.layouts[idx]?.image
        ) {
          l.image = project.layout_and_floorplan.layouts[idx].image;
        }
      });
    } else if (!data.layout_and_floorplan && project.layout_and_floorplan) {
      data.layout_and_floorplan = project.layout_and_floorplan;
    }

    // Handle about left_image
    const aboutChanged = imagesChanged(
      data.about?.left_image,
      project.about?.left_image,
    );
    if (aboutChanged && project.about?.left_image) {
      deleteImageFiles(project.about.left_image);
    } else if (!aboutChanged && project.about?.left_image) {
      if (!data.about) data.about = {};
      data.about.left_image = project.about.left_image;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      },
    );
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get only zones and launches from all projects
exports.getZonesAndLaunches = async (req, res) => {
  try {
    const projects = await Project.find({}, { zones: 1, fresh_project: 1 });
    const result = projects.map((p) => ({
      _id: p._id,
      zones: p.zones || [],
      fresh_project: p.fresh_project === true, // Ensure boolean
    }));
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get the count of all projects
exports.countProjects = async (req, res) => {
  try {
    const count = await Project.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
