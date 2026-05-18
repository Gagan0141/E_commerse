const express = require("express");
const router = express.Router();
const { authRoles } = require("../middleware/authRole");
const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
  clearCart,
  count,
} = require("../controllers/conCart");
const { verifyAccessToken } = require("../middleware/verifyToken");

router.post("/add", verifyAccessToken, authRoles("User"), addToCart);
router.delete("/:itemId", verifyAccessToken, authRoles("User"), removeFromCart);
router.put(
  "/quantity/:itemId",
  verifyAccessToken,
  authRoles("User"),
  updateCartItemQuantity,
);
router.get("/", verifyAccessToken, authRoles("User"), getCart);
router.delete("/clear", verifyAccessToken, authRoles("User"), clearCart);

router.get("/count", verifyAccessToken, count);

module.exports = router;
