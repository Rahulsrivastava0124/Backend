const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/Dashboard/ProjectController");
const {
  upload,
  autoDetectCategoryMiddleware,
} = require("../middleware/upload");

// Define all possible image fields (arrays and single images)
const projectImageFields = [
  { name: "hero.hero_images", maxCount: 10 },
  { name: "overview.overview_gallery_images", maxCount: 10 },
  { name: "highlights[].image", maxCount: 10 },
  { name: "zones[].image", maxCount: 10 },
  { name: "layout_and_floorplan.layouts[].image", maxCount: 10 },
  { name: "about.left_image", maxCount: 10 },
];

// Create a new project
router.post(
  "/projects",
  autoDetectCategoryMiddleware,
  upload.any(),
  ProjectController.createProject,
);

// Get only zones and launches from all projects
router.get("/projects/zones-launches", ProjectController.getZonesAndLaunches);

// Get a single project by ID
router.get("/projects/:id", ProjectController.getProject);

// List all projects
router.get("/projects", ProjectController.listProjects);

// Get the count of all projects
router.get("/projects-count", ProjectController.countProjects);

// Update a project by ID
router.put("/projects/:id", upload.any(), ProjectController.updateProject);

// Delete a project by ID
router.delete("/projects/:id", ProjectController.deleteProject);

module.exports = router;
