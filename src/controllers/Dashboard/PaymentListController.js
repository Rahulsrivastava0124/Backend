const PaymentList = require("../../models/PaymentList");
const {
  getUrlPath,
  saveBase64Image,
  sanitizeCategory,
  getCategoryFromRequest,
  deleteImageFiles,
} = require("../../middleware/upload");
const fs = require("fs");
const path = require("path");

const createPayment = async (req, res) => {
  try {
    const images = [];
    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "paymentlist",
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

    const newPayment = new PaymentList({ images });
    await newPayment.save();
    res
      .status(201)
      .json({ message: "Payment created successfully", data: newPayment });
  } catch (error) {
    console.error("Payment creation error:", error);
    res
      .status(500)
      .json({ message: "Error creating payment", error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentList.find();
    res
      .status(200)
      .json({ message: "Payments fetched successfully", data: payments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payments", error: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await PaymentList.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Delete old images first
    if (payment.images && Array.isArray(payment.images)) {
      deleteImageFiles(payment.images);
    }

    let images = [];
    const category = sanitizeCategory(
      getCategoryFromRequest(req) || "paymentlist",
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

    payment.images = images;
    await payment.save();
    res
      .status(200)
      .json({ message: "Payment updated successfully", data: payment });
  } catch (error) {
    console.error("Payment update error:", error);
    res
      .status(500)
      .json({ message: "Error updating payment", error: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await PaymentList.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting payment", error: error.message });
  }
};

const removePaymentImageByIndex = async (req, res) => {
  try {
    const { id, index } = req.params;
    const payment = await PaymentList.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    if (
      !Array.isArray(payment.images) ||
      index < 0 ||
      index >= payment.images.length
    ) {
      return res.status(400).json({ message: "Image index out of range" });
    }
    payment.images.splice(index, 1);
    await payment.save();
    res.status(200).json({
      message: "Image removed from payment successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing image from payment",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  updatePayment,
  deletePayment,
  removePaymentImageByIndex,
};
