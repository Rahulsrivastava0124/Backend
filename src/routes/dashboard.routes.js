const express = require("express");
const dashboardRouter = express.Router();
const { listProjects } = require("../controllers/Dashboard/ProjectController");

dashboardRouter.get("/home", (req, res) => {
  res.send("hello friend");
});

// Master data endpoint - returns all projects with master plan info
dashboardRouter.get("/master", listProjects);

module.exports = dashboardRouter;
