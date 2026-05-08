const express = require("express");
const router = express.Router();

const { vertoken } = require("../middleware/verifyToken");
const authRoles = require("../middleware/authRole");

const {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  verifyPayment,
} = require("../controllers/conOrder");

// User routes
router.post("/create", vertoken, authRoles("User"), createOrder);
router.get("/user", vertoken, authRoles("User"), getUserOrders);
router.get("/:orderId", vertoken, authRoles("User"), getOrderDetails);
router.post("/cancel/:orderId", vertoken, authRoles("User"), cancelOrder);

// Payment verification
router.post("/verify-payment", vertoken, authRoles("User"), verifyPayment);

// Admin/Vendor routes (for order management)
router.patch("/:orderId/status", vertoken, updateOrderStatus);
router.patch("/:orderId/payment-status", vertoken, updatePaymentStatus);

module.exports = router;
