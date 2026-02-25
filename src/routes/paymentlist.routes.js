const express = require("express");
const router = express.Router();
const {
  upload,
  autoDetectCategoryMiddleware,
} = require("../middleware/upload");
const {
  createPayment,
  getAllPayments,
  updatePayment,
  deletePayment,
  removePaymentImageByIndex,
} = require("../controllers/Dashboard/PaymentListController");

router.post(
  "/paymentlist",
  autoDetectCategoryMiddleware,
  upload.any(),
  createPayment,
);
router.get("/paymentlist", getAllPayments);
router.put(
  "/paymentlist/:id",
  autoDetectCategoryMiddleware,
  upload.any(),
  updatePayment,
);
router.put("/paymentlist/:id/:index", removePaymentImageByIndex);
router.delete("/paymentlist/:id", deletePayment);

module.exports = router;
