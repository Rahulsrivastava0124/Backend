const express = require("express");
const router = express.Router();
const {
  upload,
  autoDetectCategoryMiddleware,
} = require("../middleware/upload");
const {
  createAssociateDeveloper,
  getAssociateDeveloper,
  updateAssociateDeveloper,
  deleteAssociateDeveloper,
} = require("../controllers/Dashboard/AssociateDeveloperController");

router.post(
  "/associatedeveloper",
  autoDetectCategoryMiddleware,
  upload.any(),
  createAssociateDeveloper,
);
router.get("/associatedeveloper", getAssociateDeveloper);
router.put(
  "/associatedeveloper/:id",
  autoDetectCategoryMiddleware,
  upload.any(),
  updateAssociateDeveloper,
);
router.delete("/associatedeveloper/:id", deleteAssociateDeveloper);
// router.put("/associatedeveloper/index/:index", updateAssociateDeveloper);
// router.delete("/associatedeveloper/index/:index", deleteAssociateDeveloper);
router.put("/associatedeveloper/:id/:index", updateAssociateDeveloper);

module.exports = router;
