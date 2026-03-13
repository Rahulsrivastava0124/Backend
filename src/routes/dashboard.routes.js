const express = require("express");
const dashboardRouter = express.Router();
const { getMasters } = require("../controllers/Dashboard/MasterController");

dashboardRouter.get("/home", (req, res) => {
  res.send("hello friend");
});

// Master data endpoint - returns all records from masters collection
dashboardRouter.get("/master", getMasters);

module.exports = dashboardRouter;
