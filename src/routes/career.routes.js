const express = require("express");
const router = express.Router();
const CareerController = require("../controllers/Dashboard/CareerController");

// Create a new career posting
router.post("/careers", CareerController.createCareer);

// Get all careers
router.get("/careers", CareerController.listCareers);

// Get active careers only
router.get("/careers/active", CareerController.getActiveCareers);

// Get career count
router.get("/careers-count", CareerController.countCareers);

// Get a single career by ID
router.get("/careers/:id", CareerController.getCareerById);

// Update a career by ID
router.put("/careers/:id", CareerController.updateCareer);

// Toggle career status
router.patch("/careers/:id/toggle-status", CareerController.toggleCareerStatus);

// Delete a career by ID
router.delete("/careers/:id", CareerController.deleteCareer);

module.exports = router;
