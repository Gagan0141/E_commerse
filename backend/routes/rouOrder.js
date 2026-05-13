const express = require("express");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  approveOrder,
  getMyOrders,
} = require("../controllers/conOrder");

const { vertoken } = require("../middleware/verifyToken");

const { authRoles } = require("../middleware/authRole");
//user
router.post("/create", vertoken, authRoles("User"), createOrder);

router.get("/my", vertoken, authRoles("User"), getMyOrders);

//admin
router.get("/", vertoken, authRoles("Admin"), getAllOrders);

router.put("/approve/:id", vertoken, authRoles("Admin"), approveOrder);

module.exports = router;
