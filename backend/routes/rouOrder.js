const express = require("express");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/conOrder");

const { verifyAccessToken } = require("../middleware/verifyToken");

const { authRoles } = require("../middleware/authRole");
//user
router.post("/create", verifyAccessToken, authRoles("User"), createOrder);

router.get("/my", verifyAccessToken, authRoles("User"), getMyOrders);

//admin
router.get("/", verifyAccessToken, authRoles("Admin"), getAllOrders);

router.put(
  "/status/:id",
  verifyAccessToken,
  authRoles("Admin"),
  updateOrderStatus,
);

module.exports = router;
